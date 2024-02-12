sap.ui.define([
    'sap/m/MessageToast',
    'sap/m/ViewSettingsItem',
    'sap/ui/core/CustomData',
    'sap/ui/core/Fragment',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/PlacementType",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (MessageToast, ViewSettingsItem, CustomData, Fragment, Controller, Filter, FilterOperator,JSONModel, Popover, Button, List, StandardListItem, PlacementType, exportLibrary, Spreadsheet,Sorter) {
        "use strict";

        return Controller.extend("com.wipro.ticketing.controller.CustomerResolution", {
            onInit: function () {
              var that = this;
              if (!this.getView().getModel("view")) {
                  this.getView().setModel(new JSONModel(), "view");
              }
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.getRoute("RouteCresolution").attachPatternMatched(function (oEvent) {
                that.ongetCall();
 
              })
  
              },
              onAfterRendering : function(){
  this.ongetCall();
  console.log("cust id is ", this.getView().getModel("localmodel").getProperty("/CustomerId"));
},

onBack : function(){
  this.getOwnerComponent().getRouter().navTo("RouteCservice");
},

ongetCall : function(){
var that = this;
  that.getView().getModel("odatamodel").read("/resolution",{
    success: function(oData)
    {
      var val = localStorage.getItem("userrname")
      console.log("value of cust id is ", val);
      var custid =that.getView().getModel("localmodel").getProperty("/CustomerId" );
      console.log("custid", custid);
      console.log(oData.results)
      var filteredData = oData.results.filter(function(record) {
        return record.customerID === custid;
    });
      that.getView().getModel("view").setProperty("/results", filteredData);
      console.log("inside results localmodel ", that.getView().getModel("view").getProperty("/results"));
    }
 })
},

            onPress: function(){
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCservice"); 
            },
            logout : function(){
              console.log("preswsed");
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("RouteLogin");  
          },
            onPress1: function(){
                console.log("preswsed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteTresolution"); 
            },

            getResolutionData :function(){
              var that = this;
              this.getView().getModel("localmodel").read("/resolution", {

                success: function(oData)
                {
                  console.loig(oData.results)
                  var filteredData = oData.results.filter(function(record) {
                    return record.customerID === "2";
                });
                  that.getView().getModel("view").setProperty("/results", oData.results);
                  console.log("inside results localmodel ", this.getView().getModel("view").getProperty("/results"));
                }
              })



              var filteredData = data.filter(function(record) {
                return record.customerID === "2";
            });
            }
        });
    });