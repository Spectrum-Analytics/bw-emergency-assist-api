"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = exports.AssetType = exports.RiskLevel = exports.DisputeStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["OPERATOR"] = "Operator";
})(UserRole || (exports.UserRole = UserRole = {}));
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["Processing"] = "Processing";
    DisputeStatus["Verified"] = "Verified";
    DisputeStatus["Rejected"] = "Rejected";
    DisputeStatus["Contested"] = "Contested";
    DisputeStatus["Settled"] = "Settled";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["HIGH"] = "High";
    RiskLevel["INTERMEDIATE"] = "Intermediate";
    RiskLevel["LOW"] = "Low";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var AssetType;
(function (AssetType) {
    AssetType["Machinery"] = "Machinery";
    AssetType["Vehicle"] = "Vehicle";
    AssetType["Property"] = "Property";
})(AssetType || (exports.AssetType = AssetType = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["License"] = "License";
    DocumentType["NationalID"] = "Omang";
    DocumentType["Passport"] = "Passport";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
//# sourceMappingURL=enum.js.map