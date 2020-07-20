// Budget controller
var budgetController = (function () {

})();


// UI controller
var UIController = (function () {
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  }
})();


// App controller
var controller = (function (budgetCtrl, UICtrl) {

  //setup event listeners
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', function (event) {
  
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
  
    });
  }

  var ctrlAddItem = function () {
    // get field input data
    var input = UICtrl.getInput();

    // add item to the budget controller

    // add the new item to the interface

    // calculate the budget

    // display the budget on the UI

  };
  
  return {
    init: function() {
      console.log('app has started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();