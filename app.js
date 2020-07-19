// Budget controller
var budgetController = (function () {

})();


// UI controller
var UIController = (function () {

})();


// App controller
var controller = (function (budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    // get field input data

    // add item to the budget controller

    // add the new item to the interface

    // calculate the budget

    // display the budget on the UI

  }
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)

  document.addEventListener('keypress', function (event) {
    
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
    
  });

})(budgetController, UIController);