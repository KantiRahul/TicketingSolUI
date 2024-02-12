sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("com.wipro.ticketing.controller.CustomerServiceRequest", {
            onInit: function () {

        
            },
            onAfterRendering: function () {
                var servId = this.getView().getModel("localmodel").getProperty("/ServiceRequestId");
                console.log("sh", servId);
                 this.getView().getModel("localmodel").setProperty("/ServiceRequestId",servId);
                 console.log("cust id is ", this.getView().getModel("localmodel").getProperty("/CustomerId"));
                // setTimeout(this.getView().byId("custID").setValue(CustomerId), 3000)
            },
            handleChange: function(oEvent) {
                var oDatePicker = oEvent.getSource();
                var oSelectedDate = oDatePicker.getDateValue();
                console.log("Selected Date:", oSelectedDate);
            },




            onPress1: function() {
                // Get the input field values
                var sServiceRequestId = this.getView().byId("name").getValue();
                var sCustomerId = this.getView().byId("custID").getValue();
                var sIssue = this.getView().byId("issueInput").getValue();
                var sAreaOfConcern = this.getView().byId("areaInput").getValue();
                var sStatus = this.getView().byId("statusInput").getValue();
                var sPriority = this.getView().byId("priorityInput").getValue();
                var oDatePicker = this.getView().byId("DP1");
    var oExpectedDate = oDatePicker.getDateValue();
    var sExpectedDate = oExpectedDate ? oExpectedDate.toISOString() : "";
                // Get the current timestamp
                var sTimestamp = new Date().toISOString();
            
                // Create a JSON object with the field values
                var oData = {
                    "serReqID": sServiceRequestId,
                    "customerID": sCustomerId,
                    "issue": sIssue,
                    "areaOfConcern": sAreaOfConcern,
                    "timeStamp": sTimestamp,
                    "status": "Open",
                    "priority": sPriority,
                    "expectedDate":sExpectedDate,
                    "owner_customerID": sCustomerId
                };
            
                // Log the JSON object to the console
                console.log("Submitted Data:", oData);

                this.getView().getModel("odatamodel").create("/servicerequest",oData,{
                    success: function(result){
                        console.log(result);
                        MessageBox.success("Service Request created");
                     
                      
                    },




                })

            },
            
            ResolutionNav: function () {
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCresolution");
            },

            logout: function () {
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteLogin");
            }
        });
    });