<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>The Book of Shaders Gallery</title>
        <meta name="keywords" content="shader,openGL,WebGL,GLSL,procedural,generative" />
        <meta name="description" content="Gallery of Fragment Shaders of The Book of Shaders" />

        <meta name="twitter:site" content="@bookofshaders">
        <meta name="twitter:title" content="The Book Of Shaders gallery">
        <meta name="twitter:description" content="Gentle step-by-step guide through the abstract and complex universe of Fragment Shaders.">
        <meta name="twitter:creator" content="@patriciogv">
        <meta name="twitter:domain" content="thebookofshaders.com">
        <link href="/favicon.gif" rel="shortcut icon"/>

        <!-- GlslCanvas -->
        <script type="text/javascript" src="http://patriciogonzalezvivo.github.io/glslCanvas/dist/GlslCanvas.js"></script>
        
        <!-- GlslGallery -->
        <link type="text/css" rel="stylesheet" href="https://thebookofshaders.com/glslGallery/glslGallery.css">
        <script type="text/javascript" src="https://thebookofshaders.com/glslGallery/glslGallery.js"></script>

        <!-- The book of shaders style -->
        <link type="text/css" rel="stylesheet" href="https://thebookofshaders.com/css/style.css">
    </head>
    <body>
        <div class="header">
            <p class="subtitle"><a href="https://thebookofshaders.com/">The Book of Shaders</a> by <a href="http://patriciogonzalezvivo.com">Patricio Gonzalez Vivo</a> </p>
        </div>
        <hr>
        <div class="glslGallery" data="

<?php 

    $images = array_reverse(glob("*.png"));
    $ntotal = count ($images);
    $index = 0;
    $jump = 20;

    if(!empty($_GET)) {
        if(isset($_GET['index'])) {
            $index = (int)$_GET['index'];
        }
        if(isset($_GET['jump'])) {
            $jump = (int)$_GET['jump'];
        }
    }

    $from = max($jump * $index , 0);
    $to = min($jump * $index + $jump, $ntotal);

        for ($i = $from; $i < $to; $i++) {
            $log = basename($images[$i], ".png");
            echo $log;
            if ($i != $to-1) {
                echo ',';
            }
        }

    echo '">
        </div>

        <hr>
        <ul class="navigationBar" >';
        if ($from > 0) {
            echo '<li class="navigationBar"><a href="./?index='.($index-1).'&jump='.($jump).'">&lt; &lt; Previous</a></li>';
        }
        echo '<li class="navigationBar"><a href="http://thebookofshaders.com/"> Home </a></li>';
        if ($to < $ntotal) {
            echo '<li class="navigationBar"><a href="./?index='.($index+1).'&jump='.($jump).'">Next &gt; &gt;</a></li>';
        }
?>
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
</html>