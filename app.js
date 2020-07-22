// Budget controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: function (type, desc, val) {
      var newItem, Id;

      // create new id
      if (data.allItems[type].length > 0) {
        Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        Id = 0;
      }


      // create new item based on type 
      if (type === 'exp') {
        newItem = new Expense(Id, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(Id, desc, val);
      }

      // push it into data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    }
  }
})();


// UI controller
var UIController = (function () {
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },

    addListItem: function (obj, type) {
      // Create html strings with placeholder text
      var html, newHtml, element;
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert html to the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    getDOMStrings: function () {
      return DOMStrings;
    }
  }
})();


// App controller
var controller = (function (budgetCtrl, UICtrl) {

  //setup event listeners
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', function (event) {

      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }

    });
  }

  var ctrlAddItem = function () {
    var input, newItem;
    // get field input data
    input = UICtrl.getInput();

    // add item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // add the new item to the interface
    UICtrl.addListItem(newItem, input.type);
    // calculate the budget

    // display the budget on the UI

  };

  return {
    init: function () {
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();