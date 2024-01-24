import type Highcharts from "highcharts";

export const defaultOptions = ({
  titleText,
}: {
  titleText?: string;
}): Highcharts.Options => ({
  title: {
    text: titleText,
    align: "left",
    style: {
      color: "rgb(var(--font-color))",
    },
  },
  exporting: {
    enabled: false,
  },
  chart: {
    backgroundColor: "rgb(var(--background-color))",
    height: 150,
  },
  plotOptions: {
    area: {
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 2,
        states: {
          hover: {
            enabled: true,
          },
        },
      },
    },
  },
  legend: {
    enabled: false,
  },
  yAxis: {
    visible: false,
  },
  xAxis: {
    visible: false,
  },
  tooltip: {
    useHTML: true,
    shadow: true,
    shared: true,
    pointFormatter: function () {
      const month = this.x.toLocaleString("default", {
        month: "short",
      } as Record<never, never>);
      const year = new Date(this.x).getFullYear();
      const day = new Date(this.x).getDay();
      const value = Intl.NumberFormat("en", {
        maximumSignificantDigits: 3,
        notation: "compact",
      }).format(this.y!);
      return `${day} ${month} ${year} <br /><strong>${value}</strong>`;
    }!,
    headerFormat: "",
  },
});
