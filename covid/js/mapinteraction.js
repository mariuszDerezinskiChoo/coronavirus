$(function() {
    attachHandlers();
})

function attachHandlers() {
    //map table selector
    //hover over states
    //hover over counties
    $(".us-states").on("mouseover", 'path', handleStateHover);
    $(".us-states").on("mouseleave", 'path', handleStateLeave);
    $(".us-states").on('mousemove', 'path', function(e) {
        $('#popup').css('top', e.pageY-20).css('left', e.pageX+10);
        
    });
   
    $(".us-state-counties").on('mousemove', 'path', function(e) {
        $('#popup').css('top', e.pageY-20).css('left', e.pageX+10);
    });

    $('.us-state-counties').on("mouseover", 'path', handleCountyHover)
    $('.us-state-counties').on('mouseleave', 'path', handleCountyLeave);

}
function handleCountyLeave(event) {
    $('#popup').hide();
}
function handleStateLeave(event) {
    $('#popup').hide();
}

function handleCountyHover(event) {
    let f = function() {
        $('#popup').fadeIn(200);
        county = event.target.id.split('__')[0];
        state = abbrevToStates[event.target.id.split('__')[1]];
        cases = model.getCountyData(county, state,"03-30-2020");
        $('#popup-state').html(county);
        $('#popup-body').html(cases.cases)
    }

    debounce(f, 60);
    
}
function handleStateHover(event) {
    let f = function() {
        $('#popup').fadeIn(200);
        $('#popup-state').html(event.target.id);
    }
    debounce(f, 80);
    
    
}
let timeout;
function debounce(fn, timeDelay) {
    clearTimeout(timeout);
    timeout = setTimeout( () => {
        fn();
    }, timeDelay);
}