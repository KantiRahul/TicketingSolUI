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

        return Controller.extend("com.wipro.ticketing.controller.Login", {
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
            onLoginPress : function(){
              var sUserType = this.byId("userTypeSelect").getSelectedItem().getKey();
              var sUsername = this.byId("usernameInput").getValue();
              var sPassword = this.byId("passwordInput").getValue();
              var ist=0;
              var oData = {
                "userName": sUsername,
                "password": sPassword
            };   
            var that = this;
            var timestamp = new Date().getTime();
            var randomNumber = Math.floor(Math.random() * 9000) + 1000;
            var serviceRequestId = "SR-" + timestamp + "-" + randomNumber;
            this.getView().getModel("localmodel").setProperty("/ServiceRequestId",serviceRequestId);
           console.log ("service id is :",this.getView().getModel("localmodel").getProperty("/ServiceRequestId"));
           if (sUserType === "technician") {
            // Navigate to technician page
            that.getOwnerComponent().getRouter().navTo("RouteTresolution");
        } else if (sUserType === "customer") {
            // Navigate to customer page
            that.getOwnerComponent().getRouter().navTo("RouteCservice");
        }
            
            this.getView().getModel("localmodel").setProperty("/CustomerId",sUsername);

            console.log("cust id is ", this.getView().getModel("localmodel").getProperty("/CustomerId"));
           
          },


            onLoginPress1: function() {

              var sUserType = this.byId("userTypeSelect").getSelectedItem().getKey();
              var sUsername = this.byId("usernameInput").getValue();
              var sPassword = this.byId("passwordInput").getValue();
              var ist=0;
              

            var timestamp = new Date().getTime();
            var randomNumber = Math.floor(Math.random() * 9000) + 1000;
            var serviceRequestId = "SR-" + timestamp + "-" + randomNumber;
            this.getView().getModel("localmodel").setProperty("/ServiceRequestId",serviceRequestId);
           console.log ("service id is :",this.getView().getModel("localmodel").getProperty("/ServiceRequestId"));

            
            this.getView().getModel("localmodel").setProperty("/CustomerId",sUsername);
            console.log("cust id is ", this.getView().getModel("localmodel").getProperty("/CustomerId"));
            if (!sUsername && !sPassword) {
              MessageBox.error("Please enter required fields");
            }
            else if (!sUsername) {
                MessageBox.error("Please enter  ID.");
              } else if (!sPassword) {
                MessageBox.error("Please enter  password.");
              }
              else {
                var that=this;
                var model=this.getView().getModel("localmodel")

                if (sUserType === "technician") {
                  // Navigate to technician page
                  this.getView().getModel("odatamodel").read("/technician",
                  {
                    success: function(result)
                    {
                      console.log(result)
                      
                      var size=result.results.length;
                        for(let i=0;i<size;i++)
                        {
                          if(result.results[i].technicianID==sUsername && result.results[i].password==sPassword)
                          {
  
                          var flag=1;
                          ist=i;
                          break;
                          }
                        }
                        if(flag==1)
                        {
                          MessageBox.success("Tech Login Successful");
                          model.setProperty("/techuserrname",sUsername)
                          model.setProperty("/techpasssword",sPassword)
                          model.setProperty("/techuserId",result.results[ist].technicianID)
  
                          that.getView().byId("usernameInput").setValue("");
                          that.getView().byId("passwordInput").setValue("");
                // Perform login logic based on selected user type
  
  
  
  
                        }
  
  
                        else{
                          MessageBox.error("Username or password is wrong");
                          that.getView().byId("usernameInput").setValue("");
                          that.getView().byId("passwordInput").setValue("");
                        }
                    }
                  })



                  that.getOwnerComponent().getRouter().navTo("RouteTresolution");
              }
                else if (sUserType === "customer") {
                  // Navigate to customer page
                  that.getOwnerComponent().getRouter().navTo("RouteCservice");
              
                this.getView().getModel("odatamodel").read("/customer",
                {
                  success: function(result)
                  {
                    console.log(result)
                    
                    var size=result.results.length;
                      for(let i=0;i<size;i++)
                      {
                        if(result.results[i].customerID==sUsername && result.results[i].password==sPassword)
                        {

                        var flag=1;
                        ist=i;
                        break;
                        }
                      }
                      if(flag==1)
                      {
                        MessageBox.success("Login Successful");
                        model.setProperty("/userrname",sUsername)
                        model.setProperty("/passsword",sPassword)
                        model.setProperty("/custId",result.results[ist].userId)
                        console.log("setting custid ", model.getProperty("/custId") );
                        var value = resultesult.results[ist].userId
                        localStorage.setItem("userrname", value);
                        that.getView().byId("usernameInput").setValue("");
                        that.getView().byId("passwordInput").setValue("");
              // Perform login logic based on selected user type




                      }


                      else{
                        MessageBox.error("Username or password is wrong");
                        that.getView().byId("usernameInput").setValue("");
                        that.getView().byId("passwordInput").setValue("");
                      }
                  }
                })
                
                }
              
             
              }












          },
          
            onUserTypeChange: function (event) {
                var selectedKey = event.getSource().getSelectedItem().getKey();
                var signUpButton = this.getView().byId("signupButton");
                signUpButton.setEnabled(selectedKey === "customer");
            },
            onSignUp: function () {
              console.log("preswsed");
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("Signup");
          },
            onSignUpPress: function() {
                var oView = this.getView();
          
                // Create the popover
                var oPopover = new Popover({
                  title: "Sign Up",
                  contentWidth: "300px",
                  content: [
                    new Input({ placeholder: "Customer ID" }),
                    new Input({ placeholder: "Customer Name" }),
                    new Input({ placeholder: "Password", type: "Password" }),
                    new Button({
                      text: "Sign Up",
                      press: function() {
                        var oCustomer = {
                          customerId: oPopover.getContent()[0].getValue(),
                          customerName: oPopover.getContent()[1].getValue(),
                          password: oPopover.getContent()[2].getValue()
                      };
                      
                      console.log(oCustomer);
                        MessageToast.show("Successfully signed up");
                        oPopover.close();
                      }
                    })
                  ]
                });
          
                // Open the popover
                oPopover.openBy(oView.byId("signupButton"));
              }
            });
    });
