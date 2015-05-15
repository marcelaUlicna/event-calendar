/**
 * Created by Marcela on 28. 4. 2015.
 */

///<reference path="../typing/jquery.d.ts" />

module Calendar {
    export interface ISettings {
        events: Array<IEvent>;
        editable: boolean;
        localization: ILocalization;
        locale?: string;
    }

    export interface ILocalization {
        messageSentence: string;
        noteSentence: string;
        submitButton: string;
        deleteButton: string;
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