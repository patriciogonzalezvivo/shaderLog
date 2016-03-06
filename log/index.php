<?php 
    $path = "..";
    include($path."/header.php");

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
        <li class="navigationBar" onclick="homePage()"> Home </li>
    </ul>';

    include($path."/footer.php"); 
?>