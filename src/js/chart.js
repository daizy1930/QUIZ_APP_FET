google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawPieChart);

$(document).ready(function () {
  $ent = "";
  $gk = "";
  $sport = "";
  $lit = "";
  $com = "";
  $attampts = [];
  $highscore = [];
  //AJAX Call for data
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/users",
    async: false,

    success: function (data, status) {
      // Fetching scores from the data (12/30) percent/username
      for ($i = 0; $i < data.length; $i++) {
        if (data[$i].ent != "Not Attampted") {
          $ent +=
            (
              100 *
              (data[$i].ent.split("/")[0] / data[$i].ent.split("/")[1])
            ).toFixed(2) + "/";
          $ent += data[$i].ent + "/" + data[$i].username + "  ";
        }
        if (data[$i].lit != "Not Attampted") {
          $lit +=
            (
              100 *
              (data[$i].lit.split("/")[0] / data[$i].lit.split("/")[1])
            ).toFixed(2) + "/";
          $lit += data[$i].lit + "/" + data[$i].username + "  ";
        }

        if (data[$i].sport != "Not Attampted") {
          $sport +=
            (
              100 *
              (data[$i].sport.split("/")[0] / data[$i].sport.split("/")[1])
            ).toFixed(2) + "/";
          $sport += data[$i].sport + "/" + data[$i].username + "  ";
        }
        if (data[$i].gk != "Not Attampted") {
          $gk +=
            (
              100 *
              (data[$i].gk.split("/")[0] / data[$i].gk.split("/")[1])
            ).toFixed(2) + "/";
          $gk += data[$i].gk + "/" + data[$i].username + "  ";
        }
        if (data[$i].com != "Not Attampted") {
          $com +=
            (
              100 *
              (data[$i].com.split("/")[0] / data[$i].com.split("/")[1])
            ).toFixed(2) + "/";
          $com += data[$i].com + "/" + data[$i].username + "  ";
        }
      }
    },
    // Alert in case of error
    error: function (data, status) {
      alert("error");
    },
  });

  // Subject array for the graph
  sub = ["Entertainment", "Literature", "Sport", "GK", "Commerce"];

  // Data of Entertainment in the arrays
  $ent = $ent.split("  ");
  $ent.pop();
  $ent.sort();
  $ent_attampt = $ent.length;
  $ent_high = $ent[$ent_attampt - 1].split("/")[0]; //percentage
  $ent_high_user = $ent[$ent_attampt - 1].split("/")[3]; //username
  $attampts.push($ent_attampt); //pushing in attampts array
  $highscore.push(parseFloat($ent_high)); //pushing highest scores in array

  // Data of Literature in the arrays
  $lit = $lit.split("  ");
  $lit.pop();
  $lit.sort();
  $lit_attampt = $lit.length;
  $lit_high = $lit[$lit_attampt - 1].split("/")[0];
  $lit_high_user = $lit[$lit_attampt - 1].split("/")[3];
  $attampts.push($lit_attampt);
  $highscore.push(parseFloat($lit_high));

  // Data of Sports in the arrays
  $sport = $sport.split("  ");
  $sport.pop();
  $sport.sort();
  $sport_attampt = $sport.length;
  $sport_high = $sport[$sport_attampt - 1].split("/")[0];
  $sport_high_user = $sport[$sport_attampt - 1].split("/")[3];
  $attampts.push($sport_attampt);
  $highscore.push(parseFloat($sport_high));

  // Data of GK in the arrays
  $gk = $gk.split("  ");
  $gk.pop();
  $gk.sort();
  $gk_attampt = $gk.length;
  $gk_high = $gk[$gk_attampt - 1].split("/")[0];
  $gk_high_user = $gk[$gk_attampt - 1].split("/")[3];
  $attampts.push($gk_attampt);
  $highscore.push(parseFloat($gk_high));

  // Data of Commerce in the arrays
  $com = $com.split("  ");
  $com.pop();
  $com.sort();
  $com_attampt = $com.length;
  $com_high = $com[$com_attampt - 1].split("/")[0];
  $com_high_user = $com[$com_attampt - 1].split("/")[3];
  $attampts.push($com_attampt);
  $highscore.push(parseFloat($com_high));
});

//Pie chart for number of attempts in different categories

function drawPieChart() {
  datapoints = [["Category", "No. of Questions"]];

  var x;
  for (x = 0; x < sub.length; x++) {
    datapoints.push([sub[x], $attampts[x]]);
  }
  var options = {
    title: "Attempts- Category Wise",
    colors: ["#F28482", "#84A59D", "#F5CAC3", "#F7EDE2", "#F6BD60"],
    legend: { position: "bottom", textStyle: { color: "#255", fontSize: 14 } },
  };

  // Create DataTable and add the array to it.
  var figures = google.visualization.arrayToDataTable(datapoints);

  // Define the chart type (LineChart) and the container (a DIV in our case).
  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart.draw(figures, options);
}
// ---------------------------Bar Chart--------------------------------------
google.charts.load("current", { packages: ["bar"] });
google.charts.setOnLoadCallback(drawBarChart);

//Bar chart for highest scores in different categories
function drawBarChart() {
  datapoints = [["Category", "Percent"]];
  var y;
  for (y = 0; y < sub.length; y++) {
    datapoints.push([sub[y], $highscore[y]]);
  }

  var options = {
    title: "High Scores- Category wise",
    width: 500,
    legend: { position: "none" },
    chart: { title: "High scores", subtitle: "Category wise" },
    bars: "vertical", // Required for Material Bar Charts.
    vAxis: { format: "percent" },
    axes: {
      x: {
        0: { side: "bottom", label: "High Scores" }, // Top x-axis.
      },
    },
    bar: { groupWidth: "100%" },
  };

  // Create DataTable and add the array to it.
  var figures = google.visualization.arrayToDataTable(datapoints);

  // Define the chart type (LineChart) and the container (a DIV in our case).
  var chart = new google.charts.Bar(document.querySelector("#barchart"));
  chart.draw(figures, options);
}
