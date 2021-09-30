function showProgressBar(show) {
      var overlayDiv = document.createElement("div");
      var loaderDiv = document.createElement("div");
      overlayDiv.id = "overlay";
      loaderDiv.id = "loader";
      overlayDiv.className += "overlay";
      loaderDiv.className += "loader";
      if (show) {
          div1 = document.getElementById(overlayDiv.id)
          div2 = document.getElementById(loaderDiv.id);
          if (!div2) {
              document.body.appendChild(loaderDiv);
          }
          if (!div1) {
              document.body.appendChild(overlayDiv);
          }
      } else {
          overlayDiv = document.getElementById(overlayDiv.id)
          loaderDiv = document.getElementById(loaderDiv.id);
          if (overlayDiv) {
              overlayDiv.remove();
          }
          if (loaderDiv) {
              loaderDiv.remove();
          }
      }
}

function showToast(text)
{
    try{
        if (typeof android !== 'undefined')
        {
            android.showToast(text);
        }
		else
		{
			alert(text);			
		}	
    }
    catch(err) {
    }
}
 

function Connect(ip, port)
{
	var ret = false;
    try{
        //console.log("Connecting...");
        if (typeof android !== 'undefined')
        {
			showProgressBar(true);
            while (!android.Connect(ip, port)){}
            document.body.style.backgroundColor = "black";
			showProgressBar(false);
			ret = true;
        }
    }
    catch(err) {
        showToast(err);
    }
	return ret;
}

function Send(data)
{
	var ret = null;
    try{
        if (typeof android !== 'undefined')
        {
            ret = android.Send(data);
        }
    }
    catch(err) {
        showToast(err);
    }
	return ret;
}

function Recv()
{
	var ret = null;
    try{
        if (typeof android !== 'undefined')
        {
			if ((ret = android.Recv()) == "")
			{
				ret = null;
			}
        }
    }
    catch(err) {
        showToast(err);
    }
	return ret;
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
 

function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }
  
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  
  return new Uint8Array(a);
}

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}

function Read()
{
	var data;
	if ((typeof android !== 'undefined') &&
		((data = Recv()) != null))
	{
		var str = Utf8ArrayToStr(hexStringToByte(data));
		//console.log(str);
		showToast(str);
	}
}

var isOn = true;

function Light()
{
	var dbRef = firebase.database().ref();
	var updates = {};
	var elem = document.getElementById("btnOUs");
	if (isOn)
	{
        updates['lightOn'] = false;
        dbRef.update(updates);
		
		elem.textContent = "OFF";
		elem.style.backgroundColor = "Red";
		isOn = false;
	}
	else
	{
        updates['lightOn'] = true;
        dbRef.update(updates);
	  
		elem.textContent = "ON";
		elem.style.backgroundColor = "Green";
		isOn = true;
	}
}

$("button").click(function(){
	Light();
});

showProgressBar(true);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAgkTiDipYAZpj8VtoFydqntzuu72fF04",
  authDomain: "doorlockeriot.firebaseapp.com",
  databaseURL: "https://doorlockeriot-default-rtdb.firebaseio.com",
  projectId: "doorlockeriot",
  storageBucket: "doorlockeriot.appspot.com",
  messagingSenderId: "509465156455",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

	  
window.addEventListener("load", function(){
    // if (Connect("192.168.4.1", 8888))
	// {
		// (function(){
			// Read()
			// setTimeout(arguments.callee, 1);
		// })();
		
		// if (!Send(new Uint8Array([0x2A, 0x2B])))
		// {
			// showToast("Failed to send!");
			// showProgressBar(false);
		// }
		// else
		// {
			// showToast("Sent!");
		// }
	// }
	// else
	// {
		// showToast("Failed to connect!");
		// showProgressBar(false);
	// }
	
  
	  var dbRef = firebase.database().ref();
		dbRef.once("value")
		.then(function(snap) {
		  Light(snap.child("lightOn").val());
		  showProgressBar(false);
		  document.body.style.backgroundColor = "black";
  });
});



