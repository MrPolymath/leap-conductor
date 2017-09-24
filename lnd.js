/**
 * Created by nick-dev on 9/23/17.
 */
<script>
function getHandHeight(palmPosition){
    //Range is 100-450
    // console.log(palmPosition);
    height = (palmPosition[1]/400)*100;
    if (height >100){
        height=100;
    }
    else if (height<11){
        height=0;
    }
    return height;
}


</script>