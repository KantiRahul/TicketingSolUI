sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/Input",
    "sap/m/Label"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox, JSONModel,Popover, Button, VBox,Input, Label) {
        "use strict";

        return Controller.extend("com.wipro.ticketing.controller.Signup", {
            onInit: function () {
                var oData = {
                    loginTypes: [{
                        key: "customer",
                        text: "Customer Login"
                    }, {
                        key: "technician",
                        text: "Technician Login"
                    }]
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);
            },
            onPress: function () {
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCservice");
            },

            onLoginPress: function() {
              var sUserType = this.byId("userTypeSelect").getSelectedItem().getKey();
              var sUsername = this.byId("usernameInput").getValue();
              var sPassword = this.byId("passwordInput").getValue();
              
              // Perform login logic based on selected user type
              if (sUserType === "technician") {
                  // Navigate to technician page
                  this.getOwnerComponent().getRouter().navTo("RouteTresolution");
              } else if (sUserType === "customer") {
                  // Navigate to customer page
                  this.getOwnerComponent().getRouter().navTo("RouteCservice");
              }
          },
          


        onSignUp: function() {
                var oIdInput = this.byId("idInput"),
                oNameInput = this.byId("nameInput"),
                oPasswordInput = this.byId("passwordInput");
                var timestamp = new Date().getTime();
                var randomNumber = Math.floor(Math.random() * 9000) + 1000;
                var serviceRequestId = "SR-" + timestamp + "-" + randomNumber;
                this.getView().getModel("localmodel").setProperty("/ServiceRequestId",serviceRequestId);
               console.log ("service id is :",this.getView().getModel("localmodel").getProperty("/ServiceRequestId"));
            var oData = {
                "customerID": oIdInput.getValue(),
                "customerName": oNameInput.getValue(),
                "password": oPasswordInput.getValue()
            };
        
    
            var that = this;
            this.getView().getModel("localmodel").setProperty("/CustomerId",oIdInput.getValue());

            console.log("cust id is ", this.getView().getModel("localmodel").getProperty("/CustomerId"));
            this.getView().getModel("odatamodel").read("/customer",{
              success: function(result){
                var size = result.results.length;
                for (let i = 0; i < size; i++) {
                  if (result.results[i].customerID == oData.customerID) {
                    var flag = 1;
                    break;
                  }
                  else if (result.results[i].customerName == oData.customerName) {
                    var flag = 2;
                    break;
                  }
                  else if (result.results[i].password == oData.password) {
                    var flag = 3;
                    break;
                  }
                }
                if (!oData.customerID && !oData.customerName && !oData.password) {
                    MessageBox.error("Required fields cannot be empty");
                  }else if (flag==1) {
                    MessageBox.error("userID alreaady exists");
                  } else if (flag == 2) {
                    MessageBox.error("userName already exists");
                  } else{
            that.getView().getModel("odatamodel").create("/customer",oData,{
              success: function(result){
                console.log(result);
                 
                MessageBox.success("User successfully created");
                that.getView().getModel("localmodel").setProperty("/custId",oData.customerID );
                var oRouter = that.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCservice");
                
              },
              error: function (oError) {

                    MessageBox.error("Error occurred while signing up,please fill the data again");
   
                }

            })
        }

    }
  })

   




},


            });
    })
