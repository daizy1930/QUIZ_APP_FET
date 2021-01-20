$(document).ready(function () {
  $a = sessionStorage.getItem("username");
  $username_s = $a;

  $ent = "";
  $lit = "";
  $tech = "";
  $gk = "";
  $sports = "";
  if ($username_s) {
    // values are not empty
    $.ajax({
      //to check if subject is attempted or not

      method: "GET",
      url: "http://localhost:3000/users/?username=" + $username_s,
      async: false,
      // contentType: "application/json; charset=utf-8",

      success: function (data, status) {
        console.log(data);
        $flag = 0;

        $ent = data[0].ent;
        $lit = data[0].lit;
        $sports = data[0].sport;
        $gk = data[0].gk;
        $comp = data[0].com;

        // if quiz is not attempted creating attempt now button

        if ($ent == "Not Attampted") {
          $("#ent").append(
            "<td colspan='4'> NOT attempted yet!<button class='startquiz' id='ent'>Attempt Now</button></td>"
          );
        }

        //if quiz is attempted displaying the result
        else {
          $("#ent").append("<td>" + $ent.split("/")[1] + "</td>");
          $("#ent").append("<td>" + $ent.split("/")[0] + "</td>");

          //if result is positive
          if (parseInt($ent.split("/")[0]) > 0) {
            $("#ent").append(
              "<td>" +
                (
                  (parseInt($ent.split("/")[0]) /
                    parseInt($ent.split("/")[1])) *
                  100
                ).toFixed(2) +
                "</td>"
            );
          }

          //if result is negative
          else {
            $("#ent").append("<td>-</td>");
          }
        }
        if ($lit == "Not Attampted") {
          $("#lit").append(
            "<td colspan='4'> NOT attempted yet!<button class='startquiz' id='lit'>Attempt Now</button></td>"
          );
        } else {
          $("#lit").append("<td>" + $lit.split("/")[1] + "</td>");
          $("#lit").append("<td>" + $lit.split("/")[0] + "</td>");
          if (parseInt($lit.split("/")[0]) > 0) {
            $("#lit").append(
              "<td>" +
                (
                  (parseInt($lit.split("/")[0]) /
                    parseInt($lit.split("/")[1])) *
                  100
                ).toFixed(2) +
                "</td>"
            );
          } else {
            $("#lit").append("<td>-</td>");
          }
        }

        if ($sports == "Not Attampted") {
          $("#sports").append(
            "<td colspan='4'> NOT attempted yet!<button class='startquiz' id='sport'>Attempt Now</button></td>"
          );
        } else {
          $("#sports").append("<td>" + $sports.split("/")[1] + "</td>");
          $("#sports").append("<td>" + $sports.split("/")[0] + "</td>");
          if (parseInt($sports.split("/")[0]) > 0) {
            $("#sports").append(
              "<td>" +
                (
                  (parseInt($sports.split("/")[0]) /
                    parseInt($sports.split("/")[1])) *
                  100
                ).toFixed(2) +
                "</td>"
            );
          } else {
            $("#sports").append("<td>-</td>");
          }
        }
        if ($gk == "Not Attampted") {
          $("#gk").append(
            "<td colspan='4'> NOT attempted yet!<button class='startquiz' id='gk'>Attempt Now</button></td>"
          );
        } else {
          $("#gk").append("<td>" + $gk.split("/")[1] + "</td>");
          $("#gk").append("<td>" + $gk.split("/")[0] + "</td>");
          if (parseInt($gk.split("/")[0]) > 0) {
            $("#gk").append(
              "<td>" +
                (
                  (parseInt($gk.split("/")[0]) / parseInt($gk.split("/")[1])) *
                  100
                ).toFixed(2) +
                "</td>"
            );
          } else {
            $("#gk").append("<td>-</td>");
          }
        }
        if ($comp == "Not Attampted") {
          $("#comp").append(
            "<td colspan='4'> NOT attempted yet!<button class='startquiz' id='com'>Attampt Now</button></td>"
          );
        } else {
          $("#comp").append("<td>" + $comp.split("/")[1] + "</td>");
          $("#comp").append("<td>" + $comp.split("/")[0] + "</td>");
          if (parseInt($comp.split("/")[0]) > 0) {
            $("#comp").append(
              "<td>" +
                (
                  (parseInt($comp.split("/")[0]) /
                    parseInt($comp.split("/")[1])) *
                  100
                ).toFixed(4) +
                "</td>"
            );
          } else {
            $("#comp").append("<td>-</td>");
          }
        }
      },
      error: function (data, status) {
        alert("error");
      },
    }); // success
  }

  //redirecting to quiz page on click attempt now button
  $(".startquiz").click(function () {
    window.location.replace("quizzz.html?sub=" + $(this).attr("id"));
  });
});
