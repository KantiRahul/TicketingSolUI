sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/wipro/ticketing/model/models"],function(e,i,t){"use strict";return e.extend("com.wipro.ticketing.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
//# sourceMappingURL=Component.js.map