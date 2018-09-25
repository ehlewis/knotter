function inactivity_timer() {
    console.log("created");
    var idleTime = 0;
    //Increment the idle time counter every minute.
    setInterval(function(){
        idleTime = idleTime + 1;
        if (idleTime > 19) { // 20 minutes
            $.get( "/api/logout");
            window.location.href="/landing";
        }
    }, 60000); // Increments every minute up to 20 times = 20 mins

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        console.log("zero");
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
}
