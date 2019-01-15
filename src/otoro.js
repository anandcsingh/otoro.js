var otoro = function () {
    var templateElement;
    var containerElement;
    var me;
    var lastRowClass = "autoRow-last-row";
    var tempRowClass = "autoRow-temp-row";
    var templateClass;
    var namerFunc;
    var rowAddedFunc;
    var deletedFunc;

    function temp(template, container) {
        var clone = templateElement.clone();
        clone.addClass(tempRowClass);
        clone.find('.autoRow-remove').hide();

        clone.find("input, select").focus(function (event) {
            makeLast(event);
        });
        containerElement.append(clone);
        clone.css("display", "");//block
    }
    function makeLast(event, data) {
        var row = $(event.target).closest(templateClass);
        row.unbind();
        row.removeClass(tempRowClass);
        if (containerElement.find('.' + tempRowClass).length == 0) {
            temp(templateElement, containerElement);
        }
        renameAllElements();
        if (rowAddedFunc) {
            rowAddedFunc(row, containerElement);
        }
        var deleteBtn = row.find('.autoRow-remove');
        deleteBtn.show();
        deleteBtn.click(function (event) {
            $(event.target).closest(templateClass).remove();
            renameAllElements();
            if (deletedFunc) {
                deletedFunc(row, containerElement);
            }
        });
        if (data) {
            var rowControls = $(row[0].children);

            for (var i = 0; i < rowControls.length; i++) {
                var current = $(rowControls[i]);
                var fieldName = current.attr("data-name");
                current.val(data[fieldName]); // only works for inputs
            }
        }
    }

    function renameAllElements() {
        var children = containerElement.children().not('.' + tempRowClass);
        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            if(namerFunc) {
                namerFunc(item, i);
            }
        }
    }

    return {
        init: function (template, container, namer, rowAdded, deleted, seedData) {
            me = this;
            templateClass = template;
            templateElement = $(template);
            containerElement = $(container);
            temp(templateElement, containerElement);
            namerFunc = namer;
            rowAddedFunc = rowAdded;
            deletedFunc = deleted;
            
            if (seedData && seedData.length > 0) {
                for (var i = 0; i < seedData.length; i++) {
                    var evt = {};
                    evt.target = $(".autoRow-temp-row")[0].children[0];
                    makeLast(evt, seedData[i]);
                }
            }
        },

        data: function (container) {
            var rowsList = $(container).find(".autoRow-template").not('.autoRow-temp-row');
            var data = [];
            for (var i = 0; i < rowsList.length; i++) {
                var rowControls = $(rowsList[i]).find("input,select");
                var rowItem = {};
                for (var j = 0; j < rowControls.length; j++) {
                    var control = $(rowControls[j]);
                    var name = control.attr('data-name');
                    rowItem[name] = control.val();
                }

                data.push(rowItem);

            }
            return data;
            
        }
    };
};
