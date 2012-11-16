# Videojs tech for DASHR. #

In this repo you will find the source of the wrapper to DASHR to be used with videojs.

## Once videojs is build, here is how to use it ##

<script src=”videojs.js” />



          <video id="example" class="video-js vjs-default-skin" controls autoplay width="640" height="264" 
                      data-setup='{"DASHR_API" : "../../AxthimaDASH/api", 
                      "preselected_tracks" : { "video" : {"id_aset" : 0, "id_rep" : 0} }, 
                      "techOrder": [“html5”, “flash”, "axthima"] }'>
                      
               <source src="../../car-20120827-manifest.mpd" type='video/dash' />
          
          </video>


It works the same way other technologies does.


- **Source type**  : video/dash

Options to specify in data-setup :

- **techOrder** : used to tell videojs in which order and what playback technologies to use, be sure to add axthima to enable DASH playback.

- **DASHR_API**, where is the DASHR api located.  


- **preselected_tracks** (optionnal) : It’s used to tell DASHR with which tracks to start the playing. To come : it will be possible to choose with an attribute such as language

Don’t hesitate to specify alternative source type in case of your visitors browser doesn’t support Media API.

**In downloads you can find a build version of videojs integrating this wrapper.**

Exemple in action on : [http://dashr.option-isia-ecp.fr/](http://dashr.option-isia-ecp.fr/ "http://dashr.option-isia-ecp.fr/")
