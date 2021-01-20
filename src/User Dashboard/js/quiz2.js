$(document).ready(function () {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };

  $a = sessionStorage.getItem("username");
  $y = "";
  $category = $(location).attr("href").split("=")[1];
  $answers = "";
  $weight = "";
  $uanswer = "";
  $res = 0;
  $total_ques = 0;
  $qnames = [];
  $non_att = 0;
  $correct = 0;
  $incorrect = 0;
  $total_marks = 0;
  $con_submit = false;
  $notes = "";

  $.ajax({
    url: "http://localhost:3000/" + $category + "/",
    method: "GET",
    dataType: "JSON",
    async: false,

    // to calculate total marks and to find out total questions

    success: (x) => {
      $total_ques = x.length;
      for ($n = 0; $n < x.length; $n++) {
        $total_marks += parseInt(x[$n].weight);
      }

      // to display important notes before starting the quiz
      $notes +=
        "<h2 class='display-4'><strong> " +
        $category.toUpperCase() +
        " QUIZ </strong></h2>";
      $notes += "<h4 class='display-6'>Important Notes</h4>";
      $notes +=
        '<div class="h6 ps-5 my-4"> Total Questions :' + $total_ques + "</div>";
      $notes +=
        '<div class="h6 ps-5 mb-4"> Time Limit :' +
        $total_ques +
        " Minutes</div> ";
      $notes +=
        '<div class="h6 ps-5 mb-4"> Total Marks :' +
        $total_marks +
        "<br> Each Question has different weightage</div>";
      $notes +=
        '<div class="h6 ps-5 mb-4"> Negative Marking : 25% Of the respective weightage of question </div>';
      $notes +=
        '<div class="h6 ps-5 mb-4"> Quiz Will be autosubmitted when time runs out</div>';

      //creating start quiz button
      $notes +=
        '<div class="h6 ps-5 mb-4"><button id="startquiz" class="btn btn-warning btn-lg">Start Quiz</button></div>';
      $("#mainNav").html(
        "<img class='img-fluid contain' src='../../images/qv.png'>"
      );
      $("#mainArticle").html($notes);
    },
  });

  //function on startquiz

  $("#startquiz").click(function (e) {
    //setting and displaying timer based on the number of questions

    var countDownDate = new Date().getTime() + parseInt($total_ques) * 60000;

    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for hours, minutes and seconds
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("timer").innerHTML =
        "Time reamining : " + hours + ":" + minutes + ":" + seconds;

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML += "EXPIRED";
      }
    }, 1000);

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };

    //timeout quiz autosubmit

    setTimeout(function () {
      $con_submit = true;
      $("#count").trigger("click");
    }, parseInt($total_ques) * 60000);

    e.preventDefault();

    $.ajax({
      url: "http://localhost:3000/" + $category + "/",
      method: "GET",
      dataType: "JSON",
      async: false,

      success: (x) => {
        $content = "";
        $total_ques = x.length;
        $non_att = $total_ques;

        /// creating buttons to navigate to particular question

        for ($n = 0; $n < x.length; $n++) {
          if (($n + 1) % 3 == 0) {
            $content +=
              "<button class='btn btn-outline-primary' onclick=jump(" +
              $n +
              ") id='qq" +
              ($n + 1) +
              "'>" +
              ($n + 1) +
              "</button><br>";
          } else {
            $content +=
              "<button class='btn btn-outline-primary' onclick=jump(" +
              $n +
              ") id='qq" +
              ($n + 1) +
              "'>" +
              ($n + 1) +
              "</button>";
          }
        }

        // initializing content in question pallet
        $content += "<div id='flagged' class='h6 mt-4'>Flagged : 0</div><br>";
        $content +=
          "<div class='lead'>Not Attempted:<button class='btn btn-outline-primary'></button></div>";
        $content +=
          "<div class='lead'>Attempted:<button class='btn btn-primary'></button></div>";
        $content +=
          "<div class='lead'>Flagged:<button class='btn btn-outline-danger'></button></div>";
        $content += "<div id='non' class='notatt'>Not Attempted:</div><br>";
        $content +=
          "<button id='count' class='btn btn-success'>Submit</button>";
        $content += "<div id='timer'></div>";
        $("#mainNav").html($content);
        $("#non").css("background-color", " rgb(10, 22, 71)");
        $("#non").css("color", "white");
        $("#non").css("margin-top", "100px");

        $qcontent = "";

        for (var i = 0; i < x.length; i++) {
          $answers += x[i].Answer + "  ";
          console.log(x[i].Answer);
          $weight += x[i].weight + "  ";
          $random = Math.floor(Math.random() * 3);

          //randoom options displaying
          if ($random == 0) {
            $qcontent +=
              "<div id='q" +
              (i + 1) +
              "'>" +
              (i + 1) +
              " " +
              x[i].question +
              "<label>Weight : " +
              x[i].weight +
              "</label><button onclick='flag(" +
              (i + 1) +
              ",this)' class='flag btn btn-warning'>Flag</button><button id='reset" +
              (i + 1) +
              "' class='reset btn btn-danger'>Reset</button><br><br><label>";
            $qcontent +=
              "<input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].Answer +
              "'>" +
              x[i].Answer +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option1 +
              "'>" +
              x[i].option1 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option2 +
              "'>" +
              x[i].option2 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option3 +
              "'>" +
              x[i].option3 +
              "</label><br><br></div>";

            //image not present
            if (x[i].img != undefined) {
              $qcontent += "<label> <img src='" + x[i].img + "'></img></div>";
            }
          }
          if ($random == 1) {
            $qcontent +=
              "<div id='q" +
              (i + 1) +
              "'>" +
              (i + 1) +
              " " +
              x[i].question +
              "<label>Weight : " +
              x[i].weight +
              "</label><button onclick='flag(" +
              (i + 1) +
              ",this)' class='flag btn btn-warning'>Flag</button><button id='reset" +
              (i + 1) +
              "' class='reset btn btn-danger'>Reset</button><br><br><label>";
            $qcontent +=
              "<input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option3 +
              "'>" +
              x[i].option3 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option2 +
              "'>" +
              x[i].option2 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].Answer +
              "'>" +
              x[i].Answer +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option1 +
              "'>" +
              x[i].option1 +
              "</label><br><br></div>";

            if (x[i].img != undefined) {
              $qcontent += "<label> <img src='" + x[i].img + "'></img></div>";
            }
          }
          if ($random == 2) {
            $qcontent +=
              "<div id='q" +
              (i + 1) +
              "'>" +
              (i + 1) +
              " " +
              x[i].question +
              "<label>Weight : " +
              x[i].weight +
              "</label><button onclick='flag(" +
              (i + 1) +
              ",this)' class='flag btn btn-warning'>Flag</button><button id='reset" +
              (i + 1) +
              "' class='reset btn btn-danger'>Reset</button><br><br><label>";
            $qcontent +=
              "<input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option2 +
              "'>" +
              x[i].option2 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option3 +
              "'>" +
              x[i].option3 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option1 +
              "'>" +
              x[i].option1 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].Answer +
              "'>" +
              x[i].Answer +
              "</label><br><br></div>";

            if (x[i].img != undefined) {
              $qcontent += "<label> <img src='" + x[i].img + "'></img></div>";
            }
          }
          if ($random == 3) {
            $qcontent +=
              "<div id='q" +
              (i + 1) +
              "'>" +
              (i + 1) +
              " " +
              x[i].question +
              "<label>Weight : " +
              x[i].weight +
              "</label><button onclick='flag(" +
              (i + 1) +
              ",this)' class='flag btn btn-warning'>Flag</button><button id='reset" +
              (i + 1) +
              "' class='reset btn btn-danger'>Reset</button><br><br><label>";
            $qcontent +=
              "<input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option1 +
              "'>" +
              x[i].option1 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].Answer +
              "'>" +
              x[i].Answer +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option3 +
              "'>" +
              x[i].option3 +
              "</label><br>";
            $qcontent +=
              "<label> <input type='radio'name='q" +
              (i + 1) +
              "' value='" +
              x[i].option2 +
              "'>" +
              x[i].option2 +
              "</label><br><br></div>";
            if (x[i].img != undefined) {
              $qcontent += "<label> <img src='" + x[i].img + "'></img></div>";
            }
          }
        }
        //populating div with questions and options with reset and flag button

        $("#mainArticle").html($qcontent);
      },
      error: function (response) {
        console.log(response);
      },
    });

    // intializing not attempted total number of questions
    $("#non").append($total_ques);
    for ($m = 0; $m < $total_ques; $m++) {
      $qnames.push("q" + ($m + 1));
    }

    //finalizing correct answer and weight array
    $answers = $answers.split("  ");
    $weight = $weight.split("  ");
    $answers.pop();
    $weight.pop();

    $(".reset").click(function () {
      //checking if option is selected or not
      if (
        $(
          "input[name=q" + $(this).attr("id").split("t")[1] + "]:checked"
        ).val() != undefined
      ) {
        // reseting option and incrementing not attempted question

        $("input[name=q" + $(this).attr("id").split("t")[1] + "]").prop(
          "checked",
          false
        );
        $non_att++;

        $("#qq" + $(this).attr("id").split("t")[1]).css({
          "border-color": "#0275d8",
          "background-color": "white",
          color: "#0275d8",
        });
        $("#non").text("Non Attepted :" + $non_att);
      } else {
        alert("No option is selected");
      }
    });

    // function on submit button
    $("#count").click(function () {
      //checking if quiz is to be submitted automatically or not

      if (!$con_submit) {
        if ($non_att != 0) {
          //asking for confirmation before submitting

          $con_submit = window.confirm(
            "You have " + $non_att + " Question, Do you still want to submit?"
          );
        } else {
          $con_submit = true;
        }
      }
      if ($con_submit) {
        $ans = "";

        //populating user answers

        for ($i = 0; $i < $qnames.length; $i++) {
          $uanswer += $("input[name=" + $qnames[$i] + "]:checked").val() + "  ";
        }
        $uanswer = $uanswer.split("  ");
        $uanswer.pop();

        for ($i = 0; $i < $answers.length; $i++) {
          //not attempted
          if ($uanswer[$i] == "undefined") {
            $("div[id=" + $qnames[$i] + "]").css({
              border: "2px solid rgba(128,128,128,0.6)",
              "margin-top": "10px",
            });
            $("div[id=" + $qnames[$i] + "]").css("color", "black");
            $("div[id=" + $qnames[$i] + "]").append(
              "Not Attampted :Correct Answer " + $answers[$i]
            );
          } else if ($answers[$i] == $uanswer[$i]) {
            // correct answer
            $correct++;
            $res += parseInt($weight[$i]);
            $("div[id=" + $qnames[$i] + "]").css({
              "background-color": "rgba(0,255,0,0.6)",
              "margin-top": "10px",
            });
            $("div[id=" + $qnames[$i] + "]").append("Correct Answer");
          } else {
            //wrong answer
            $res -= parseInt($weight[$i]) * 0.25;

            $("div[id=" + $qnames[$i] + "]").css({
              "background-color": "rgba(255,0,0,0.6)",
              "margin-top": "10px",
            });
            $("div[id=" + $qnames[$i] + "]").css("color", "white");
            $("div[id=" + $qnames[$i] + "]").append(
              "Wrong Answer : Correct Answer  " + $answers[$i]
            );

            $incorrect++;
          }

          $(".reset").remove();
          $(".flag").remove();
        }
        //displaying counter for not attempted-attempted-wrong-correct answer

        $percenntage = ($res / $total_marks).toFixed(4) * 100;
        $("#mainNav").html(
          "<strong><div class='text-primary'> Result : " +
            $res +
            " Out of " +
            $total_marks +
            " </div><br><div class='text-warning'> Percentage : " +
            $percenntage +
            "</div><br><div class='text-success'>Correct Ans: " +
            $correct +
            "</div><br><div class='text-danger'> Wrong Ans: " +
            $incorrect +
            "</div><br><div class='text-info'>Attampted: " +
            ($total_ques - $non_att) +
            "</div><br><div class='text-secondary'>Not Attampted: " +
            $non_att
        ) + "</div></strong>";
        $("#mainNav").append(
          "<br><button id='home' class='btn btn-primary text-white'>Home</button>"
        );
        $("#home").click(function () {
          window.location.replace("userdashboard.html");
        });

        $username_s = $a;
        if ($username_s) {
          // fetching id of user object from json to patch
          $.ajax({
            method: "GET",
            url: "http://localhost:3000/users",
            async: false,

            success: function (data, status) {
              e.preventDefault();

              for ($i = 0; $i < data.length; $i++) {
                if (data[$i].username == $username_s) {
                  $y = data[$i].id;

                  break;
                }
              }
            },
            error: function (data, status) {
              alert("error");
            },
          }); // success
        }

        // upadting result according to the subject name
        if ($category == "ent") {
          $.ajax({
            type: "PATCH",

            url: "http://localhost:3000/users/" + $y,
            dataType: "json",
            async: false,

            data: {
              ent: $res + "/" + $total_marks,
            },
            success: function (response) {
              e.preventDefault();
            },
          });
        }
        if ($category == "lit") {
          $.ajax({
            type: "PATCH",

            url: "http://localhost:3000/users/" + $y,
            dataType: "json",
            async: false,

            data: {
              lit: $res + "/" + $total_marks,
            },
            success: function (response) {
              e.preventDefault();
            },
          });
        }
        if ($category == "sport") {
          $.ajax({
            type: "PATCH",

            url: "http://localhost:3000/users/" + $y,
            dataType: "json",
            async: false,

            data: {
              sport: $res + "/" + $total_marks,
            },
            success: function (response) {
              e.preventDefault();
            },
          });
        }
        if ($category == "gk") {
          $.ajax({
            type: "PATCH",

            url: "http://localhost:3000/users/" + $y,
            dataType: "json",
            async: false,

            data: {
              gk: $res + "/" + $total_marks,
            },
            success: function (response) {
              e.preventDefault();
            },
          });
        }
        if ($category == "com") {
          $.ajax({
            type: "PATCH",

            url: "http://localhost:3000/users/" + $y,
            dataType: "json",
            async: false,

            data: {
              com: $res + "/" + $total_marks,
            },
            success: function (response) {
              e.preventDefault();
            },
          });
        }
      }
    });

    $("input").change(function () {
      $non_att = $total_ques;

      for ($i = 0; $i < $qnames.length; $i++) {
        //on question attempting

        if ($("input[name=" + $qnames[$i] + "]:checked").val() != undefined) {
          $non_att--;
          $("button[id=qq" + ($i + 1) + "]").css("background-color", "#0275d8");
          $("button[id=qq" + ($i + 1) + "]").css("color", "white");
        }
      }
      $("#non").text("Non Attepted :" + $non_att);
    });
  });
});
//navigation
function jump(val) {
  val++;

  var element = document.getElementById("q" + val);
  element.scrollIntoView({
    behavior: "smooth",
  });
}
var flagged = 0;
var preval = 0;
var flax = [];

//flag function
function flag(val, x) {
  console.log(flax);
  var a = document.getElementById("qq" + val);

  if (flax[val] != 0) {
    flagged++;
    a.style.borderWidth = "3px";
    a.style.borderColor = "red";
    x.innerHTML = "Unflag";
    flax[val] = 0;
  } else {
    flagged--;
    //  a.style.backgroundColor="rgb(41, 12, 80)";
    a.style.borderWidth = "1px";
    a.style.borderColor = "#0275d8";
    x.innerHTML = "Flag";
    flax[val] = 1;
  }

  document.getElementById("flagged").innerHTML = "Flagged : " + flagged;
}
