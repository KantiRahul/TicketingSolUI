sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox"],function(e,t){"use strict";return e.extend("com.wipro.ticketing.controller.CustomerServiceRequest",{onInit:function(){},onAfterRendering:function(){var e=this.getView().getModel("localmodel").getProperty("/ServiceRequestId");console.log("sh",e);this.getView().getModel("localmodel").setProperty("/ServiceRequestId",e);console.log("cust id is ",this.getView().getModel("localmodel").getProperty("/CustomerId"))},handleChange:function(e){var t=e.getSource();var o=t.getDateValue();console.log("Selected Date:",o)},onPress1:function(){var e=this.getView().byId("name").getValue();var o=this.getView().byId("custID").getValue();var r=this.getView().byId("issueInput").getValue();var s=this.getView().byId("areaInput").getValue();var i=this.getView().byId("statusInput").getValue();var n=this.getView().byId("priorityInput").getValue();var a=this.getView().byId("DP1");var u=a.getDateValue();var c=u?u.toISOString():"";var l=(new Date).toISOString();var g={serReqID:e,customerID:o,issue:r,areaOfConcern:s,timeStamp:l,status:"Open",priority:n,expectedDate:c,owner_customerID:o};console.log("Submitted Data:",g);this.getView().getModel("odatamodel").create("/servicerequest",g,{success:function(e){console.log(e);t.success("Service Request created")}})},ResolutionNav:function(){console.log("preswsed");var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("RouteCresolution")},logout:function(){console.log("preswsed");var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("RouteLogin")}})});
//# sourceMappingURL=CustomerServiceRequest.controller.js.map