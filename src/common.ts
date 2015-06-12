///<reference path="../typing/jquery.d.ts" />

module Calendar {
    export interface ISettings {
        events: Array<IEvent>;
        editable: boolean;
        localization: ILocalization;
        locale?: string;
        data?: Array<IData>;
        moveAction?: any;
        submitData?: any;
        deleteData: any;
    }

    export interface ILocalization {
        messageSentence: string;
        noteSentence: string;
        submitButton: string;
        deleteButton: string;
    }

    export interface IData {
        date: Date;
        event: string;
        message: string;
        note: string;
    }

    export interface IMoveAction {
        data: Array<IData>;
        move(year: number, data?: Array<IData>): JQueryPromise<any>;
    }
    
    export interface ICalendarAction {
        data: Array<IData>;
        process(data: Array<IData>): void;
    }

    export interface IEvent {
        name: string;
        backgroundColor?: string;
        color?: string;
    }

    export interface IArrayIndexes {
        start: number;
        end: number;
    }

    export interface IModalDialog {
        start: any;
        end: any;
        events: Array<IEvent>;
        selectedEvent: string;
        defaultBgColor: string;
        defaultColor: string;
        message?: string;
        personalNote?: string;
        localization: ILocalization;
    }

    export enum DialogResult {
        Submit,
        Delete,
        Cancel
    }
}