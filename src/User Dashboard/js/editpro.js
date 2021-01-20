$(document).ready(function () {
  $result = "";
  $a = sessionStorage.getItem("username");

  $username = $a;
  $flag = 0;
  $email = "";
  $newpassword = "";
  $uid = "";
  $pwd = "";
  $sdid = "";

  $validate2 = $validate1 = false;
  $resetf = 0;
  localStorage.setItem("username", $username);
  $username = localStorage.getItem("username");

  $.ajax({
    url: "http://localhost:3000/users/",
    method: "GET",
    dataType: "JSON",
    async: false,

    success: (x) => {
      for ($i = 0; $i < x.length; $i++) {
        if (x[$i].username == $username) {
          $email = x[$i].email;
          $uid = x[$i].id;
          $pwd = x[$i].password;

          $result = x[$i].result;
        }
      }
      $("#uname").val($username);
      $("#email").val($email);
    },
    error: function (response) {
      console.log(response);
    },
  });
  $("#resetpwd").click(function () {
    if ($validate1) {
      if ($validate2) {
        console.log($email);
        $username = $("#uname").val();
        $email = $("#email").val();
        $.ajax({
          type: "PATCH",

          url: "http://localhost:3000/users/" + $uid,
          dataType: "json",
          async: false,
          data: {
            password: md5($newpassword),
          },
          success: function (response) {
            alert("updated");
            sessionStorage.clear();
            $(window).attr("location", "../../html/index.html");
          },
        });
      } else {
        alert("Password does not match");
      }
    } else {
      alert("Incorrect Password");
    }
    $resetf = 0;
    //    }
  });
  $validate_user = false;
  $("#uname").keyup(function () {
    $.ajax({
      url: "http://localhost:3000/users/",
      method: "GET",
      dataType: "JSON",
      async: false,

      success: (x) => {
        for ($i = 0; $i < x.length; $i++) {
          if (x[$i].username == $(this).val() && $("#uname") != $a) {
            $validate_user = true;
          }
        }
      },
    });
  });
  $validate_email = false;
  $("#uname").keyup(function () {
    $.ajax({
      url: "http://localhost:3000/users/",
      method: "GET",
      dataType: "JSON",
      async: false,

      success: (x) => {
        for ($i = 0; $i < x.length; $i++) {
          if (x[$i].email == $(this).val() && $("#email") != $email) {
            $validate_email = true;
          }
        }
      },
    });
  });
  $(".edit").click(function () {
    if ($flag == 0) {
      $(".update").attr("disabled", false);
      $(".update").attr("focus", true);
      $(this).text("Save");
      $flag = 1;
    } else {
      if ($validate_user == true) {
        alert("Username already exists");
      } else if ($validate_email == true) {
        alert("email already exists");
      } else {
        $(".update").attr("disabled", true);

        alert("UPDated");
        $(this).text("Edit");
        $flag = 0;
        $username = $("#uname").val();
        $email = $("#email").val();
        $.ajax({
          type: "PATCH",

          url: "http://localhost:3000/users/" + $uid,
          dataType: "json",
          async: false,
          data: {
            username: $username,
            email: $email,
          },
          success: function (response) {
            alert("updated");

            sessionStorage.setItem("username", $username);
            location.reload();
          },
        });
      }
    }
  });
  $("#pwd").keyup(function () {
    $.ajax({
      url: "http://localhost:3000/users/",
      method: "GET",
      dataType: "JSON",
      async: false,

      success: (x) => {
        for ($i = 0; $i < x.length; $i++) {
          if (x[$i].username == $username) {
            if (x[$i].password == md5($(this).val())) {
              $("#check").show();
              $(".npwd").attr("disabled", false);
              $(".npwd").eq(0).focus();
              $validate1 = true;
            } else {
              $("#check").hide();
              $(".npwd").attr("disabled", true);
              $validate1 = false;
            }
          }
        }
      },
      error: function (response) {
        console.log(response);
      },
    });
  });
  $(".npwd").keyup(function () {
    if (
      $(".npwd").eq(0).val() == $(".npwd").eq(1).val() &&
      $(".npwd").eq(0).val() != null &&
      $(".npwd").eq(1).val() != null
    ) {
      $newpassword = $(".npwd").eq(0).val();
      $validate2 = true;
    } else {
      $validate2 = false;
    }
  });

  $("#del").click(function () {
    $.ajax({
      url: "http://localhost:3000/users/" + $uid,
      method: "DELETE",
      success: function (response) {
        sessionStorage.clear();
        $(window).attr("location", "../../html/index.html");

        console.log(response);
      },
      error: function (response) {
        console.log(response);
      },
    });
  });
});
