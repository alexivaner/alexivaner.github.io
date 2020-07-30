const btns = document.getElementsByClassName("button");
title = document.querySelector("#title");
greetings = document.querySelector(".greetings");
article = document.querySelector("article");



function updateTime(){
  greetings = document.querySelector(".greetings");
  d = new Date();
  time = d.getHours();

  if (time < 12 && time> 6) {
    greetings.innerHTML = "Good morning!";
  }else if(time<18 && time>=12) {
    greetings.innerHTML = "Good afternoon!";
  }else if (time >=18 && time< 22){
    greetings.innerHTML = "Good evening!";
  }else{
    greetings.innerHTML = "Good Night! Don't forget to sleep!";
  }
}


for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    updateDisplay(this)
  });
}

function updateDisplay(target) {
  article.style.opacity = 0;
  title.style.opacity = 0;
  setTimeout(function() {
    title.innerHTML = target.innerText;
    if (target.innerText == "HOME") {
      article.id = "home";
      article.innerHTML = "<h2><span class=\"greetings\">Good morning</span><br> I am Ivan</h2><p>I received bachelor degree in Electrical Engineering at Petra Christian University, Indonesia in 2019. Then continue my study of master degree at Electrical Engineering and Computer Science in National Chiao Tung University, Taiwan. My field of interest includes Artificial Intelligence, IoT, robotics, and automation. My side-jobs are videographies, photographies, and design. </p>"
      updateTime();
    } else if (target.innerText == "WORKS") {
      article.id = "work";
      article.innerHTML = "<div class=\"container\"><div class=\"row\"><div class=\"col-md-4\"><div class=\"serviceBox\"><div class=\"service-icon\"><a href=\"#\"><span><i class=\"fa fa-low-vision\"></i></span></a></div><div class=\"service-content\"><h3>AI and Machine Learning</h3><p>Control Interface using Voice Recognition in AR Glasses (In Progress),<br><a href=\"https://github.com/alexivaner/Travel-Salesman-Problem-using-GA\" target=\"_blank\">Travel Salesman Problem using Genetic Algorithm</a>,<br><a href=\"https://github.com/alexivaner/face-recognition-attendance-sytem-OpenCV-Python\" target=\"_blank\">Face Recognition Attendance System with OpenCV</a>,<br><a href=\"#\">Implementation of Generative Adversarial Network Face Aging using DSLR Camera</a>,<br><a href=\"https://github.com/alexivaner/Smart-Door-with-Face-Recognition-and-Google-Assistant\" target=\"_blank\">Face Recognition Smart Door with Google Assistant</a>,<br></p></div></div></div></div><div class=\"row\"><div class=\"col-md-4\"><div class=\"serviceBox\"><div class=\"service-icon\"><a href=\"#\"><span><i class=\"fa fa-android\"></i></span></a></div><div class=\"service-content\"><h3>Web and App Development (Unity and Android)</h3><p><a href=\"https://github.com/alexivaner/ApplicationGithubUser\" target=\"_blank\">GithubAPI User Application</a>,<a href=\"https://github.com/alexivaner/COVIDStatistic-Android-App\" target=\"_blank\">Covid-Statistic API Application</a>,<a href=\"https://github.com/alexivaner/GadgetX-Android-App\" target=\"_blank\">GadgetX - Smartphone Specification Finder App(Prototype)</a>,<br><a href=\"https://github.com/alexivaner/Pong2DCovid19Series-Game-Unity\" target=\"_blank\">Simple Unity Game - Pong 2D</a>,<br><a href=\"http://samudraluasmakmur.com/\" target=\"_blank\">Website of PT Samudra Luas Makmur Sejahtera (samudraluasmakmur.com) </a>,</p></div></div></div></div><div class=\"row\"><div class=\"col-md-4\"><div class=\"serviceBox\"><div class=\"service-icon\"><a href=\"#\"><span><i class=\"fa fa-bolt\"></i></span></a></div><div class=\"service-content\"><h3>Electrical Engineering (Hardware and Software Integration)</h3><p><a href=\"https://youtu.be/W2UmUKfTkp8\" target=\"_blank\">SecureX - Prototype of Innovated Smart Door</a>,<br><a href=\"https://youtu.be/ob6De2c_8XE\" target=\"_blank\">Automatic IoT Lifting Bridge with Siemens S7-1200</a>,<br><a href=\"https://youtu.be/mWQRHR8GrJM\" target=\"_blank\">3DOF Kinematic Robot</a>,<br><a href=\"https://youtu.be/fJvOMFCaZIk\" target=\"_blank\">Quadruped Robot using MCS8951</a>,<br><a href=\"https://youtu.be/jLpZxsFxOC0\" target=\"_blank\">Digital Scale Weigher Electronic Instrumentation System</a></p></div></div></div></div></div>"
    } else if (target.innerText == "ABOUT") {
      article.id = "about";
      article.innerHTML = "<div class=\"container\"><div class=\"row\"><div class=\"col-md-3 col-sm-6\"><div class=\"about-profile\"><div id=\"profile-photo\"><img src=\"assets/image/DSC_3546.jpg\" alt=\"\"></div><div class=\"team-profile\"><h3 class=\"team-title\"><a href=\"#\">Ivan Surya Hutomo</a></h3><span class=\"post\">IoT, Computer Scientist, Web Designer, App Development</span><p class=\"description\">I am an aspiring engineer who enjoys connecting dots: be it ideas from different disciplines, people from different teams, or applications from different industries. I have strong technical skillsand an academic background in electrical engineering, deep learning, and web design. I love doing the integration between hardware and software, that makes me love doing some of IoT projects.<br><br>I took undergraduate study in Petra Christian University especially in Electrical Engineering. I joined many organization to sharpen my softskill in communicating ideas with other people. I also have some side-jobs as web designer, photographer, and videographer that really sharpen my knowledge about handle many different kind of people.In my graduate, I made some website for PT Samudra Luas Makmur (an Aluminium Diecasting factory in Indonesia), I also became teaching assistant of web programming, android app development, and basics programming courses.<br><br>After graduated from Petra Christian University, I continue my study at National Chiao Tung University. I took Electrical Engineering and Computer Science as my major.In my graduate studies, I have taken on various project roles, including involved in Drone AR and Voice Recognition Control Interface project, I communicate and discuss with many library developer to provide information about bugsand many things to improve in the library. After involved in Voice Recognition team, now I already familiar with NLP and model conversion. I helped Barracuda Unity Developer for finnding a newbug in Barracuda library where Barracuda could not receive more than one batch of tensor by examining the tensor input using my vector from voice recognition of ONNXModel. I also helped ONNX Microsoft developer for enhance Sklearn2Onnx library and add new features for supporting Barracuda in Unity by giving recommendation whatfeatures to add, what ONNX Operators are still not supported in Barracuda, and my prototype of code.<br><br>My passion lies in solving business problems by do the integration between hardware and software fluently and communicating complex ideas to non-technical stakeholders. I am able to jump across verticals to deliverhigh-performing AI solutions.I'm interested in IoT, app development, web design, data science, and machine learning. Please feel free to get in touch with me via email at <a href=\"mailto:hutomoivan@gmail.com\" target=\"_blank\">hutomoivan@gmail.com</a>. <br><br><strong>Proficient: Python, HTML, CSS</strong><br><strong>Knowledgeable: NLP (Natural Language Processing) JS, PHP, C#, Assembly</strong><br><strong>Familiar: Kotlin, Java </strong><br><strong>Another Skills: Design, Videographies, Photographies</strong></p><ul class=\"social-links\"><li><a href=\"https://github.com/alexivaner\" target=\"_blank\" class=\"fa fa-github\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://www.linkedin.com/in/ivan-surya-hutomo-b5746713a\" class=\"fa fa-linkedin\" target=\"_blank\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://www.instagram.com/ivan.hutomo/\" class=\"fa fa-instagram\" target=\"_blank\" style=\"text-decoration:none;\"></a></li></ul></div></div></div></div></div>"
    } else if (target.innerText == "CONTACT") {
      article.id = "contact";

      article.innerHTML = "<div class=\"contact-profile\"><div id=\"iframe-form\"><iframe src=\"https://docs.google.com/forms/d/e/1FAIpQLScVkJE3MYeaj7GrkIwDy4Eb5nk9dlMSuWzSdW-nl-zAdKozSg/viewform?embedded=true\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\" style=\"-webkit-transform:scale(0.8);-moz-transform-scale(1);\">Loading…</iframe></div><div id=\"social-contact\"><h1>Visit My Social Media below :</h1><ul class=\"social-links\"><li><a href=\"https://github.com/alexivaner\" target=\"_blank\" class=\"fa fa-github\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://www.linkedin.com/in/ivan-surya-hutomo-b5746713a\" class=\"fa fa-linkedin\" target=\"_blank\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://www.instagram.com/ivan.hutomo/\" class=\"fa fa-instagram\" target=\"_blank\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://www.youtube.com/channel/UCUHP9DeewYaRSlcZAHBEgnw\" class=\"fa fa-youtube\" target=\"_blank\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://id.pinterest.com/hutomoivan/\" class=\"fa fa-pinterest\" target=\"_blank\" style=\"text-decoration:none;\"></a></li><li><a href=\"https://unsplash.com/@alexivaner\" class=\"fa fa-camera\" target=\"_blank\" style=\"text-decoration:none;\"></a></li></ul><br><h1>Download My Resume :</h1><ul class=\"social-links\"><li><a href=\"https://drive.google.com/file/d/1vcEKKqkbeRJSfhi-YPSWDelKY6r1fd2y/view\" target=\"_blank\" class=\"fa fa-file-text-o\" style=\"text-decoration:none;\"></a></li></ul></div></div>"
    } else if (target.innerText == "RESUME") {
      article.innerHTML = "Ini RESUME"
    }
    title.style.opacity = 1;
    article.style.opacity = 1;
  }, 500);


}
