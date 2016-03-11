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

        <!-- Fetch -->
        <script type="text/javascript" src="https://rawgit.com/github/fetch/master/fetch.js"></script>

        <link type="text/css" rel="stylesheet" href="http://thebookofshaders.com/css/style.css">
        <link type="text/css" rel="stylesheet" href="./style.css">
    </head>
    <body>
        <div class="header"><p><a href="http://thebookofshaders.com/">The Book of Shaders</a> by <a href="http://patriciogonzalezvivo.com">Patricio Gonzalez Vivo</a></p></div>
        <hr>
        <div class="gallery">';

function convert_date_js_php($date){
    $datearray = explode(", ", $date);
    list($year, $month, $day) = $datearray;
    $converted_date = date("Y-m-d", mktime(0, 0, 0, $month+1, $day, $year));        
    return $converted_date;
}

    for ($i = $from; $i < $to; $i++) {
        $img = $images[$i];
        $log = basename($img, ".png");
        echo '
            <div class="gallery_item">
                <a href="http://editor.thebookofshaders.com/?log='.$log.'" data='.$log.' target="_blank" onmouseenter="mouseIn(this)" onmouseleave="mouseOut(this)" >
                    <img class="gallery_thumb" src="'.$img.'" alt="">
                    <p class="time_label"> '.$log.'</p>
                </a>
            </div>';
    }

    echo '
        </div>
        <script>
           var serverDate = '.time().';
        </script>
        <script src="main.js"></script>

        <hr>
        <ul class="navigationBar" >';
        
        if ($from > 0) {
            echo '<li class="navigationBar"><a href="./?index='.($index-1).'&jump='.($jump).'">&lt; &lt; Previous</a></li>';
        }

        echo '<li class="navigationBar"><a href="http://thebookofshaders.com/"> Home </a></li>';
        
        if ($to < $ntotal) {
            echo '<li class="navigationBar"><a href="./?index='.($index+1).'&jump='.($jump).'">Next &gt; &gt;</a></li>';
        }
        
        echo '
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