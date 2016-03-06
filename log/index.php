<?php 
// main menu
echo '
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>The Book of Shaders Gallery</title>
        <meta name="keywords" content="shader,openGL,WebGL,GLSL,procedural,generative" />
        <meta name="description" content="Gallery of Fragment Shaders of The Book of Shaders" />

        <meta name="twitter:site" content="@bookofshaders">
        <meta name="twitter:title" content="The Book Of Shaders">
        <meta name="twitter:description" content="Gentle step-by-step guide through the abstract and complex universe of Fragment Shaders.">
        <meta name="twitter:creator" content="@patriciogv">
        <meta name="twitter:domain" content="thebookofshaders.edu">
        <link href="/favicon.gif" rel="shortcut icon"/>

        <!-- GlslCanvas -->
        <script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/build/GlslCanvas.min.js"></script>

        <link type="text/css" rel="stylesheet" href="css/style.css">
    </head>
    <body>
    ';

    $images = array_reverse(glob("*.png"));

    echo '
    <div class="header"><p><a href="http://thebookofshaders.com/">The Book of Shaders</a> by <a href="http://patriciogonzalezvivo.com">Patricio Gonzalez Vivo</a></p></div>
    <hr>
    <div class="gallery">';

    foreach ($images as &$img) {
        $log = basename($img, ".png");
        echo '
        <div class="gallery_item">
            <a href="http://editor.thebookofshaders.com/?log='.$log.'" target="_blank">
                <img class="gallery_thumb" src="'.$img.'" alt="">
                <p> '.$log.'</p>
            </a>
        </div>';
    }

    echo '
        </div>
        <hr>
        <ul class="navigationBar" >
            <li class="navigationBar"><a href="http://thebookofshaders.com/"> Home </a></li>
        </ul>
        <footer>
            <p> Copyright 2015 <a href="http://www.patriciogonzalezvivo.com" target="_blank">Patricio Gonzalez Vivo</a> </p>
        </footer>

        <script>
          (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,"script","//www.google-analytics.com/analytics.js","ga");

          ga("create", "UA-18824436-2", "auto");
          ga("send", "pageview");
        </script>
    </body>
</html>';
?>