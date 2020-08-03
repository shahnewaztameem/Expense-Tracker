// Budget controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  }

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

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
    },
    budget: 0,
    percentage: -1
  }

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

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
    },

    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expences 
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expense
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc) * 100;
      } else {
        data.percentage = -1;
      }

    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      })
      return allPercentages;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function () {
      return console.log(data)
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'

  }

  var formatNumber = function (num, type) {
    // + or - before the number
    // exactly 2 decimal points
    // comma seperated thousand
    var numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    }
    type === 'exp' ? sign = '-' : sign = '+';

    return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    addListItem: function (obj, type) {
      // Create html strings with placeholder text
      var html, newHtml, element;
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // insert html to the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    removeListItem: function (selectorId) {
      var element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);

    },
    clearFields: function () {
      var fields, fieldsArray;
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function (current, index, array) {
        current.value = '';
      });

      fieldsArray[0].focus();
    },

    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');


      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },
    displayPercentages: function (percentages) {
      var field = document.querySelectorAll(DOMStrings.expensesPercLabel);

      
      nodeListForEach(field, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function () {
      var now, months, month, year;
      now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];

      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function () {
      var fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescription + ',' +
      DOMStrings.inputValue);

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus'); 
      });
      // add red color to submit button
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    // change input color 
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  }

  var updateBudget = function () {
    // calculate the budget
    budgetCtrl.calculateBudget();

    // return the budget
    var budget = budgetCtrl.getBudget();

    // display the budget on the UI
    UICtrl.displayBudget(budget)
  };

  var updatePercentages = function () {
    // calculate the percentages
    budgetCtrl.calculatePercentages();

    // read the percentages from budget controller
    var percentages = budgetCtrl.getPercentages();

    // update the UI
    UICtrl.displayPercentages(percentages);
  }

  var ctrlAddItem = function () {
    var input, newItem;
    // get field input data
    input = UICtrl.getInput();

    // validation
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // add the new item to the interface
      UICtrl.addListItem(newItem, input.type);

      // clear the fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitId, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitId = itemID.split('-');
      type = splitId[0];
      ID = parseInt(splitId[1]);

      // 1. delete item from the ds
      budgetCtrl.deleteItem(type, ID)

      // 2. delete item from UI
      UICtrl.removeListItem(itemID);

      // 3. show and update the new budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      })
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();