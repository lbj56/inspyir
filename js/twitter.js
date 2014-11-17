// Twitter Marquee
// Source:  http://andreaslagerkvist.com/archives/2011/06/24/how-to-create-a-scrolling-twitter-feed-using-jquery/
// Updated: http://laurib.edicy.co/siutsur-load-tweets-without-oauth
 
var Siutsur=function(){return{load:function(e,t,n){this.c=t;this.ec=n;$("<script />",{src:"//cdn.syndication.twimg.com/widgets/timelines/"+e+"?&lang=en&callback=Siutsur.callback&suppress_response_codes=true&_="+Math.random()}).appendTo(document.head);},callback:function(e){if(e.headers&&e.headers.status==200){var t=$(e.body),n=[],r=t.find(">.stream>.h-feed>li.h-entry");$.each(r,function(e,t){var r=$(t),i=r.children(".permalink"),s=r.find(">.p-author>.profile"),o=s.children(".avatar"),u=r.find(">.e-entry-content>.e-entry-title");var f={id:parseInt(r.data("tweet-id"),10),permalink:i.attr("href"),published:{datetime:i.data("datetime"),label:i.text(),title:i.children("time").attr("title")},title:{regular:u.html(),plain:u.text()},user:{avatar:{bigger:o.attr("data-src-2x"),normal:o.attr("src")},link:s.attr("href"),name:s.find(">.full-name>.p-name").text(),nickname:s.find(">.p-nickname").text()}};n.push(f);});if(this.c){this.c.call(this,n);}}else{if(this.ec){this.ec.call(this);}}}};}();
 
var Twitter = {
    init: function () {
        // Pass in the username you want to display feeds for
        this.insertLatestTweets('inspyir');
    },
 
    // This replaces the <p>Loading...</p> with the tweets
    insertLatestTweets: function (username) {        
                $(function() {
                        Siutsur.load('413498366073376768', function(data) {
                                // We'll start by creating a normal marquee-element for the tweets
                                var html = '<marquee behavior="scroll" scrollamount="1" direction="left">';
 
                                // Loop through all the tweets and create a link for each
                                for (var i in data) {
                                        html += '<a href="' + data[i].permalink + '" target="_blank">' + data[i].title.plain + ' <i>' + Twitter.daysAgo(data[i].published.datetime) + '</i></a>';
                                }
 
                                html += '</marquee>';
 
                                // Now replace the <p> with our <marquee>-element
                                $('#twitter p').replaceWith(html);
 
                                // The marquee element looks quite shite so we'll use Remy Sharp's plug-in to replace it with a smooth one
                                Twitter.fancyMarquee();
                        }, function() {
                                $('#twitter p').replaceWith('<i>Error loading tweets</i>');
                        });
                });
    },
 
    // Replaces the marquee-element with a fancy one
    fancyMarquee: function () {
        // Replace the marquee and do some fancy stuff (taken from remy sharp's website)
        $('#twitter marquee').marquee('pointer')
            .mouseover(function () {
                $(this).trigger('stop');
            })
            .mouseout(function () {
                $(this).trigger('start');
            })
            .mousemove(function (event) {
                if ($(this).data('drag') == true) {
                    this.scrollLeft = $(this).data('scrollX') + ($(this).data('x') - event.clientX);
                }
            })
            .mousedown(function (event) {
                $(this).data('drag', true).data('x', event.clientX).data('scrollX', this.scrollLeft);
            })
            .mouseup(function () {
                $(this).data('drag', false);
            });
    },
 
    // Takes a date and return the number of days it's been since said date
    daysAgo: function (date) { 
        var twToday = 'today';
        var twYesterday = 'yesterday';
        var twDay = 'day ago';
        var twDays = 'days ago';
               
        // TODO: Fix date for IE...
        if ($.browser.msie) {
            return twYesterday;
        }
 
        var d = new Date(date).getTime();
        var n = new Date().getTime();
 
        var numDays = Math.round(Math.abs(n - d) / (1000 * 60 * 60 * 24));
        var daysAgo = numDays + ' ' + twDay;
 
        if (numDays == 0) {
            daysAgo = twToday;
        } else if (numDays == 1) {
            daysAgo = twYesterday;
        } else {
            daysAgo = numDays + ' ' + twDays;
        }
 
        return daysAgo;
    }
};