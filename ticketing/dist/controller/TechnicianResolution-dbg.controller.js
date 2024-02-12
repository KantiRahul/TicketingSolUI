sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Popover",
    "sap/m/MessageBox",
    "sap/m/Button",
    "sap/m/Bar",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Popover, MessageBox,Button, Bar, VBox, Label,JSONModel) {
        "use strict";

        return Controller.extend("com.wipro.ticketing.controller.TechnicianResolution", {
            onInit: function () {
                var that = this;
                if (!this.getView().getModel("view")) {
                    this.getView().setModel(new JSONModel(), "view");
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteTresolution").attachPatternMatched(function (oEvent) {
                 that.getView().getModel("odatamodel").read("/servicerequest",{
                    success: function(oData)
                    {
                      that.getView().getModel("view").setProperty("/results", oData.results);
                      console.log("inside results localmodel ", that.getView().getModel("view").getProperty("/results"));
                    }
                 })
   
                })
           
            },
            logout : function(){
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteLogin");  
            },
            onBeforeRendering : function(){
                let localmodel=this.getView().getModel("localmodel").getProperty("/technicianResolution");
                // this.getServiceRequestObject();
                // this.getView().getModel("localmodel").setProperty("/employee",localmodel );
            },
            ResolutionNav: function(){
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCresolution"); 
            },

            
            // handlePress: function (evt) {
            //     var sSrc = evt.getSource().getTarget();
            //     var oDialog = new Dialog({
            //         content: new Image({
            //             src: sSrc
            //         }),
            //         beginButton: new Button({
            //             text: 'Close',
            //             press: function () {
            //                 oDialog.close();
            //             }
            //         }),
            //         afterClose: function() {
            //             oDialog.destroy();
            //         }
            //     });
            //     oDialog.open();
            // }

            getServiceRequestObject : function(){
                var that = this;
                var oODataModel = this.getView().getModel("odatamodel");
                that.getView().getModel("odatamodel").read("/customer",
                {
                  success: function(oData)
                  {
                    that.getView().getModel("view").setProperty("/results", oData.results);
                    console.log("inside results localmodel ", this.getView().getModel("view").getProperty("/results"));
                  }
                })
            
            
            },





            handlePress: function(evt) {
                var currentDate = new Date();

// Format date and time
var formattedDateTime = currentDate.toISOString().slice(0, 19).replace("T", " ");
                var technicianName = this.getView().getModel("localmodel").getProperty("/techuserrname");
                var technicianID = this.getView().getModel("localmodel").getProperty("/techuserId");
                console.log("Tech name is ",technicianName );
                console.log("Tech id is ",technicianID);

                var oSelectedItem = evt.getSource().getBindingContext("view").getObject();
                var that = this;
                var oPopover = new sap.m.Popover({
                    title: "Issue Details",
                    contentWidth: "300px",
                    content: new sap.m.VBox({
                        items: [
                            new sap.m.Label({ text: "Service ID: " + oSelectedItem.serReqID }),
                            new sap.m.Label({ text: "Customer ID: " + oSelectedItem.customerID }),
                            new sap.m.Label({ text: "Issue: " + oSelectedItem.issue }),
                            new sap.m.Label({ text: "Area of Concern: " + oSelectedItem.areaOfConcern }),
                            new sap.m.Label({ text: "Priority: " + (oSelectedItem.priority === 0 ? "Low" : "High") }),
                            new sap.m.Label({ text: "Expiration Date: " + oSelectedItem.expectedDate }),
                            new sap.m.Label({ text: "Status: " + oSelectedItem.status }),
                            new sap.m.Label({ text: "timeStamp: " + oSelectedItem.timeStamp }),
                        ]
                    }),
                    footer: new sap.m.Bar({
                        contentMiddle: [
                            new sap.m.Button({
                                text: "Work in Progress",
                                press: function() {
                                   
                                    var oBindingContext = evt.getSource().getBindingContext("view");
                                    if (!oBindingContext) {
                                        console.error("Binding context is undefined.");
                                        return;
                                    }
                                
                                    var sPath = oBindingContext.getPath();
                                    if (!sPath) {
                                        console.error("Path to the selected item is undefined.");
                                        return;
                                    }
                                
                                    // Change status directly in the binding
                                    var oModel = oBindingContext.getModel();
                                    oModel.setProperty(sPath + "/status", "Work in Progress");
                                    var oODataModel = that.getView().getModel("odatamodel");
                                    var serReqID = oSelectedItem.serReqID;
                            
                                    // Update status in the OData entity
                                    oODataModel.update("/servicerequest('" + serReqID + "')", { status: "Work in Progress" }, {
                                        success: function() {
                                            console.log("Service request status updated to 'Work in Progress' in OData entity.");
                                        },
                                        error: function(oError) {
                                            console.error("Error updating service request status in OData entity:", oError);
                                        }
                                    });




 // Check if a record with the same serReqID already exists
oODataModel.read("/resolution('" + serReqID + "')", {
    success: function(data) {
        // If a record exists, update its resolTimeStamp
        var existingRecord = data;
        existingRecord.resolTimeStamp = formattedDateTime;
        oODataModel.update("/resolution('" + serReqID + "')", existingRecord, {
            success: function(result) {
                console.log(result);
                MessageBox.success("Ticket updated as Work in progress");
            },
            error: function(oError) {
                MessageBox.error("Error occurred while updating record");
            }
        });
    },
    error: function(oError) {
        // If no record exists, create a new record
        var oData1 = {
            "serReqID": serReqID,
            "customerID": oSelectedItem.customerID,
            "technicianID": "TEC2023",
            "technicianName": "kanti",
            "resolTimeStamp": formattedDateTime,
            "res_serReqID": "12"
        };
        oODataModel.create("/resolution", oData1, {
            success: function(result) {
                console.log(result);
                MessageBox.success("Ticket Resolved");
            },
            error: function(oError) {
                MessageBox.error("Error occurred while creating new record");
            }
        });
    }
});












                                    oPopover.close();
                                }
                                
                                
                            }),
                            new sap.m.Button({
                                text: "Resolved",
                                press: function() {
                                    var oBindingContext = evt.getSource().getBindingContext("view");
                                    if (!oBindingContext) {
                                        console.error("Binding context is undefined.");
                                        return;
                                    }
                                
                                    var sPath = oBindingContext.getPath();
                                    if (!sPath) {
                                        console.error("Path to the selected item is undefined.");
                                        return;
                                    }
                                
                                    // Change status directly in the binding
                                    var oModel = oBindingContext.getModel();
                                    oModel.setProperty(sPath + "/status", "Resolved");

                                    var oODataModel = that.getView().getModel("odatamodel");
                                    var serReqID = oSelectedItem.serReqID;
                            
                                    // Update status in the OData entity
                                    oODataModel.update("/servicerequest('" + serReqID + "')", { status: "Resolved" }, {
                                        success: function() {
                                            console.log("Service request status updated to 'Resolved' in OData entity.");
                                        },
                                        error: function(oError) {
                                            console.error("Error updating service request status in OData entity:", oError);
                                        }
                                    });
                                    var oData1 = {
                                        "serReqID": serReqID,
                                        "customerID":oSelectedItem.customerID,
                                        "technicianID": "TEC2023",
                                        "technicianName": "kanti",
                                        "resolTimeStamp": formattedDateTime,
                                        "res_serReqID":"13"
     };
     
// Check if a record with the same serReqID already exists
oODataModel.read("/resolution('" + serReqID + "')", {
    success: function(data) {
        // If a record exists, update its resolTimeStamp
        var existingRecord = data;
        existingRecord.resolTimeStamp = formattedDateTime;
        oODataModel.update("/resolution('" + serReqID + "')", existingRecord, {
            success: function(result) {
                console.log(result);
                MessageBox.success("Record updated successfully");
            },
            error: function(oError) {
                MessageBox.error("Error occurred while updating record");
            }
        });
    },
    error: function(oError) {
        // If no record exists, create a new record
        var oData1 = {
            "serReqID": serReqID,
            "customerID": oSelectedItem.customerID,
            "technicianID": "TEC2023",
            "technicianName": "kanti",
            "resolTimeStamp": formattedDateTime,
            "res_serReqID": "12"
        };
        oODataModel.create("/resolution", oData1, {
            success: function(result) {
                console.log(result);
                MessageBox.success("New record created successfully");
            },
            error: function(oError) {
                MessageBox.error("Error occurred while creating new record");
            }
        });
    }
});


                                    oPopover.close();
                                }
                            }),
                            new sap.m.Button({
                                text: "Close",
                                press: function() {
                                    oPopover.close();
                                }
                            })
                        ]
                    })
                });
                oPopover.openBy(evt.getSource());
            }
            
            
            
            


        });
    });