  var global_otp_encode;
  var global_contacts=[];
  var global_clicked_li=0;

  function displayContacts(res){
        for (var i = 0; i < res.length; i++) {
          // res[i]
          if(res[i].is_verified){
              var dt = new Date(res[i].verifiedAt);
              console.log(dt);
              var hrs=dt.getHours();
              var mins=dt.getMinutes();
              var secs = dt.getSeconds();
              //var hrs=res[i].verifiedAt.getHours();
              var date = dt.getDate();
              var day = dt.getDay();
              var locale = "en-us";
              var month = dt.toLocaleString(locale, { month: "long" });
              //var month = dt.getMonth();
              $("#contacts").append(' <li id="item'+i+'"></span><span class="name">'+res[i].fname+' '+res[i].lname+'</span><span class="heading" style="float: right;">'+"Ok"+'</span><span class="heading date" style="float: right;">'+date+' '+month+'|'+hrs+':'+mins+':'+secs+'&nbsp;</span></li>');
                            
          }
          else{

            if(res[i].verifiedAt === undefined){

            }
            $("#contacts").append(' <li id="item'+i+'"></span><span class="name">'+res[i].fname+' '+res[i].lname+'</span><span class="heading" style="float: right;">'+"No"+'</span><span class="heading date" style="float: right;">'+'&nbsp;</span></li>');
          }        
       }
  }

    $(window).load(function() {
        console.log("loaded");
        $.ajax({
            method:"GET",
            url:'/api/sendContacts',
            success:function(res){
               console.log(res);
               global_contacts=res;
               global_contacts.sort(function(a,b){
                    // console.log(dt1);
                    // console.log(dt2);
                    $("#contacts").html(' ');
                    $("#contacts").html('<li> <span class="heading">Name</span><span class="heading" style="float: right;">Status</span><span class="heading" style="float: right; margin-right: 37px; ">Last Verified &nbsp;</span></li>');
                    if(a.fname<b.fname){
                        return -1;
                    }
                    else{
                        return 1;
                    }
                });
               displayContacts(res);
               
            },
            error:function(err){
                console.log(err);
            }
        });
    })

    $(document).ready(function() {
        var oApp = $("#app-container");
        
        $('#contacts').on('click','li',function(oEvent) {
            console.log("clicked");
            oEvent.preventDefault();
            var i = $(this).index()-1;
            global_clicked_li = i;
            console.log(global_contacts);
            global_clicked_id = global_clicked_li+1;
            // global_contacts[]
            console.log(i);
            oApp.removeClass('tab1');
            oApp.addClass('tab2');
            $("#tab-2 .item-detail #name").html(global_contacts[i].fname+' '+global_contacts[i].lname);
            $("#tab-2 .item-detail #phone").html(global_contacts[i].phone);
            if(global_contacts[i].is_verified){
                $("#tab-2 .item-detail #is_verified").html('verified');   
                if($("#tab-2 .item-detail #is_verified").hasClass('show')){
                    $("#tab-2 .item-detail #sendBtn").removeClass('show');
                }
                $("#tab-2 .item-detail #sendBtn").removeClass('show');
                $("#tab-2 .item-detail #sendBtn").addClass('hide');
            }
            else{
                $("#tab-2 .item-detail #is_verified").html('Unverified'); 
                $("#tab-2 .item-detail #sendBtn").addClass('show');
            }
        });
        
        $('#tab-2 #sendBtn').on('click',function(oEvent) {
            console.log("clicked");
            oEvent.preventDefault();
            // var i=$(this).index();
            console.log(global_clicked_li);
            // console.log(i);
            var sMobileNumber = global_contacts[global_clicked_li].phone;
            console.log(sMobileNumber);
            $("#step-2 #form-step2").prepend('<div class="show-message">OTP has sent to '+sMobileNumber.substring(0,1)+'*****'+sMobileNumber.substring(sMobileNumber.length-3)+' . Please verify.'+'</div>');
            var data={
                mobileNumber:sMobileNumber
            };
            $.ajax({
                method:"POST",
                data:data,
                url:'/api/sendOTP',
                success:function(res){
                    console.log(res);
                    if(res.Status=="Success"){
                        oApp.removeClass('tab2');
                        oApp.addClass('step2');
                        global_otp_encode=res.Details;
                    }
                    else{   
                        alert(res.Details);
                    }
                },
                error:function(err){
                    console.log(err);
                }
            });
        });

        // Step 2 submit handling
        $("#form-step2").submit(function(oEvent) {
            oEvent.preventDefault();
            var sOtp = $("#verification_code").val(); 
            //------------Handle point number 4,6 in the Application Flow here --------
            //Performing $.ajax request to backend API to verify OTP and display response
            //-----------------------------------------------------------------------

            var data={
                cOtp:sOtp,
                encodedOtp:global_otp_encode,
                id:global_contacts[global_clicked_li].id
            };
            $.ajax({
                method:"POST",
                data:data,
                url:'/api/verifyOTP',
                success:function(res){
                    console.log(res);
                    if(res.Status=="Success"){
                        alert(res.Details);
                        oEvent.preventDefault();
                        window.location.href='/';
                        // alert('OTP has send to' + sMobileNumber);
                    }
                    else{
                        alert(res.Details);
                    }
                },
               error:function(err){
                    console.log(err);
                }
            });
        });

        $(".backBtn").click(function(oEvent) {
            oEvent.preventDefault();
            
            if(oApp.hasClass('tab2')){
                oApp.removeClass("tab2");
                oApp.addClass("tab1");
            }
            else if(oApp.hasClass('step2')){
                console.log("came");
                oApp.removeClass("step2");
                oApp.addClass("tab2");   
            }
        });

        $(".filter #bydate").on('click',function(oEvent){
            if($("#byname").hasClass('active')){
                $("#byname").removeClass('active');
                global_contacts.sort(function(a,b){
                    var dt1=new Date(a.verifiedAt);
                    var dt2=new Date(b.verifiedAt);
                    // var dt1 = a.verifiedAt;
                    // var dt2 = b.verifiedAt;
                    
                    console.log(dt1);
                    console.log(dt2);
                    $("#contacts").html(' ');
                    $("#contacts").html('<li> <span class="heading">Name</span><span class="heading" style="float: right;">Status</span><span class="heading" style="float: right; margin-right: 37px; ">Last Verified &nbsp;</span></li>');
                    if(dt1 < dt2 && dt1!="Invalid Date" || dt2 != "Invalid Date"){
                        return 1;
                    }
                    else{
                        return -1;
                    }
                });
                console.log(global_contacts);
                displayContacts(global_contacts);
            }
            $("#bydate").addClass('active');
        })
        $(".filter #byname").on('click',function(oEvent){
            if($("#bydate").hasClass('active')){
                $("#bydate").removeClass('active');
                global_contacts.sort(function(a,b){
                    // console.log(dt1);
                    // console.log(dt2);
                    $("#contacts").html(' ');
                    $("#contacts").html('<li> <span class="heading">Name</span><span class="heading" style="float: right;">Status</span><span class="heading" style="float: right; margin-right: 37px; ">Last Verified &nbsp;</span></li>');
                    if(a.fname<b.fname){
                        return -1;
                    }
                    else{
                        return 1;
                    }
                });
                console.log(global_contacts);
                displayContacts(global_contacts);
            }
            $("#byname").addClass('active');
        })
    });