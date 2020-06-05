<script>
    var googleqr = "http://chart.apis.google.com/chart?cht=qr&chs=150&choe=UTF-8&chid=H10"

    var text = "http//vision20.ga";
    if(text!=""){
        var qrchl = googleqr+"&chl="+encodeURIComponent(text);
        var imgtag = document.createElement("img");
        imgtag.setAttribute("id","qrcodeimg");
        imgtag.setAttribute("src",qrchl);
        imgtag.setAttribute("style",display:none;);
        document.getElementById("qr_result").removeChild(document.getElementById("qrcodeimg"));
        document.getElementById("qr_result").appendChild(imgtag);
        $("$qrcodeimg".fadeIn(1500);

        }else{
            alert("생성할 정보가 없습니다.");
        }


    });
</script>