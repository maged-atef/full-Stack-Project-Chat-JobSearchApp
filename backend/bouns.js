// *==> nums = [3,2,1,0,4] ------------> expected false 
// *==> nums = [2,3,1,1,4] ------------> expected true 


var canJump = function(nums) {
    const array_length = nums.length; 
    const second_element = nums[1]
    const uncount_element = 2
    
    return (second_element >= nums.length - uncount_element ? true: false) ; 
};