"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const notificationService_1 = require("../services/notificationService");
class NotificationController {
    fetchNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const notifications = yield notificationService_1.notificationService.fetchNotifications(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: notifications,
                    message: ' Notifications fetched successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error fetching Messages', err,
                });
            }
        });
    }
}
exports.notificationController = new NotificationController();
