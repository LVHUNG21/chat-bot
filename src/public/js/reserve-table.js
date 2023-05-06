(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/messenger.Extensions.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

function extAsyncInit() {
    MessengerExtensions.getContext('1554138315079604', // get Context: get psid of user open webview
        function success(thread_context) {
            console.log('handleClickbutton');
            // success
            // set psid to input
            $("#psid").val(thread_context.psid);
            console.log("psid: ", thread_context.psid)
            handleClickButtonReserveTable();
        },
        function error(err) {
            // error
            console.log('Lỗi đặt bàn Eric bot', err);
        }
    );
}

// validate inputs
function validateInputFields() {
    const EMAIL_REG = /[a-zA-Z][a-zA-Z0-9_\.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}/g;

    let email = $("#email");
    let phoneNumber = $("#phoneNumber");

    if (!email.val().match(EMAIL_REG)) {
        email.addClass("is-invalid");
        return true;
    } else {
        email.removeClass("is-invalid");
    }

    if (phoneNumber.val() === "") {
        phoneNumber.addClass("is-invalid");
        return true;
    } else {
        phoneNumber.removeClass("is-invalid");
    }

    return false;
}

function handleClickButtonReserveTable() {
    console.log('handleClickbutton');
    $("#btnReserveTable").on("click", function (e) {
        let check = validateInputFields(); // return true or false

        let data = {
            psid: $("#psid").val(),
            customerName: $("#customerName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val()
        };

        if (!check) {
            // close webview
            MessengerExtensions.requestCloseBrowser(function success() {
                // webview closed
            }, function error(err) {
                // an error occurred
                console.log(err);
            });

            // send data to node.js server 
            $.ajax({
                url: `${window.location.origin}/reserve-table-ajax`, // window.location.origin de lay link cuthe
                method: "POST",
                data: data,
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
}

// Wait for Messenger Extensions SDK to load
window.extAsyncInit = extAsyncInit;