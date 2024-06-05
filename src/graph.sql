
WITH RECURSIVE related_messages AS (
    SELECT *
    FROM public.ao_events e
    WHERE
        NOT is_process AND e.tags_flat ->> 'Pushed-For' = p_id
    UNION DISTINCT
    SELECT *
    FROM public.ao_events e
    WHERE
        is_process AND target = p_id
    UNION DISTINCT
    SELECT *
    FROM public.ao_events e
    WHERE
        is_process AND owner_address = p_id
    UNION DISTINCT
    SELECT *
    FROM public.ao_events e
    WHERE
        is_process AND e.tags_flat ->> 'From-Process' = p_id
), recent_relevant_messages AS (
    SELECT * FROM related_messages ORDER BY height DESC LIMIT 500
), recent_messages AS (
    SELECT *
    FROM recent_relevant_messages
    UNION
    SELECT * FROM public.ao_events WHERE id = p_id
), initial_messages AS (
    SELECT
        id,
        CASE
            WHEN is_process THEN owner_address
            ELSE 'User' END
        AS src,
        target AS dest,
        tags_flat ->> 'Action' AS action,
        tags_flat ->> 'Pushed-For' AS cranked_for,
        height
    FROM recent_messages
    WHERE (NOT is_process AND id = p_id) OR (is_process AND target = p_id)
    UNION ALL
    SELECT
        e.id,
        e.tags_flat ->> 'From-Process' AS src,
        e.target AS dest,
        e.tags_flat ->> 'Action' AS action,
        COALESCE(e.tags_flat ->> 'Pushed-For', e.tags_flat ->> 'Pushed-For') AS cranked_for,
        e.height
    FROM recent_messages e
    INNER JOIN initial_messages im ON COALESCE(e.tags_flat ->> 'Pushed-For', e.tags_flat ->> 'Pushed-For') = im.id
), aggregated_messages AS (
    SELECT * FROM initial_messages
), processes_users AS (
    SELECT DISTINCT src AS id
    FROM aggregated_messages
    UNION DISTINCT
    SELECT DISTINCT dest AS id
    FROM aggregated_messages
), nodes AS (
    SELECT
        id,
        CASE
            WHEN id = 'User' THEN 'User'
            WHEN id = p_id AND is_process THEN 'This Process'
            WHEN ae.tags_flat ->> 'Type' = 'Process' THEN 'Process ' || LEFT(id, 5) || '...' || RIGHT(id, 5)
            ELSE 'User ' || LEFT(id, 5) || '...' || RIGHT(id, 5)
        END AS label
    FROM processes_users
    LEFT JOIN ao_events ae USING (id)
), nodes_json AS (
    SELECT json_agg(json_build_object('id', id, 'label', label)) AS nodes
    FROM nodes
), edges_json AS (
    SELECT json_agg(json_build_object('from', src, 'to', dest, 'id', id, 'arrows', 'to')) AS edges
    FROM aggregated_messages
), vis_repr AS (
    SELECT * FROM edges_json JOIN nodes_json ON 1=1
), d3 AS (
    SELECT DISTINCT
      src.label source,
      dest.label target,
      src.id AS source_id,
      dest.id AS target_id,
      CASE WHEN src.label = 'User' THEN 'User Message' ELSE 'Cranked Message' END AS type,
      action
    FROM aggregated_messages
    JOIN nodes AS src ON aggregated_messages.src = src.id
    JOIN nodes AS dest ON aggregated_messages.dest = dest.id
), messages AS (
    SELECT e.*
    FROM ao_events e
    WHERE id IN (SELECT id FROM aggregated_messages) AND p_include_messages
), messages_json AS (
    SELECT row_to_json(m.*) as message FROM messages m
), message_obj AS (
    SELECT json_agg(message) messages FROM messages_json
), graph_json AS (
    SELECT json_agg(json_build_object('source', source, 'source_id', source_id, 'target', target, 'target_id', target_id, 'type', type, 'action', action)) AS graph FROM d3
)
SELECT
    json_build_object(
        'graph', graph,
        'messages', messages
    )
FROM graph_json
JOIN message_obj ON 1=1
