/// <reference path="typing/jquery.d.ts" />
/// <reference path="typing/moment.d.ts" />
/// <reference path="typing/bootstrap.d.ts" />
declare module Calendar {
    interface ISettings {
        events: Array<IEvent>;
        editable: boolean;
        localization: ILocalization;
        locale?: string;
        data?: Array<IData>;
        moveAction?: any;
        submitData?: any;
        deleteData: any;
    }
    interface ILocalization {
        messageSentence: string;
        noteSentence: string;
        submitButton: string;
        deleteButton: string;
    }
    interface IData {
        date: Date;
        event: string;
        message: string;
        note: string;
    }
    interface IMoveAction {
        data: Array<IData>;
        move(year: number, data?: Array<IData>): JQueryPromise<any>;
    }
    interface ICalendarAction {
        data: Array<IData>;
        process(data: Array<IData>): void;
    }
    interface IEvent {
        name: string;
        backgroundColor?: string;
        color?: string;
    }
    interface IArrayIndexes {
        start: number;
        end: number;
    }
    interface IModalDialog {
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
    enum DialogResult {
        Submit = 0,
        Delete = 1,
        Cancel = 2,
    }
}
declare module Calendar {
    class MoveAction implements IMoveAction {
        private _name;
        data: Array<IData>;
        move(year: number, data?: Array<IData>): JQueryPromise<any>;
    }
    class PostDataAction implements ICalendarAction {
        private _name;
        data: Array<IData>;
        process(data: Array<IData>): void;
    }
}
declare module Calendar {
    class Header {
        element: JQuery;
        year: number;
        constructor(year: number);
        render(): JQuery;
        renderHeader(): JQuery;
        renderButton(direction: string): JQuery;
        renderTitle(): JQuery;
    }
}
declare module Calendar {
    class Helpers {
        static ArrayRange(from: number, to: number, array?: Array<number>): Array<number>;
        static ArrayIndexes(indexes: IArrayIndexes): IArrayIndexes;
        static CapitalizeFirstLetter(text: string): string;
        static RenderTemplate(template: string, dict: {
            [key: string]: any;
        }): string;
    }
}
declare module Calendar {
    class MonthCalendar {
        element: JQuery;
        settings: ISettings;
        year: number;
        today: Date;
        months: Array<string>;
        weekdays: Array<string>;
        constructor(settings: ISettings, year: number);
        capitalize(): void;
        templateCalendar(): JQuery;
        templateTable(monthId: number): JQuery;
    }
}
declare module Calendar {
    class Dialog {
        dialogSettings: IModalDialog;
        templateDictionary: {
            [key: string]: any;
        };
        modal: JQuery;
        dialogResult: DialogResult;
        constructor(dialogSettings: IModalDialog);
        private getDictionary();
        show(): JQueryPromise<DialogResult>;
        click(e: JQueryEventObject): void;
        modalKeyup(e: JQueryEventObject): void;
        btnSubmit(e: JQueryEventObject): void;
        btnDelete(e: JQueryEventObject): void;
        btnClose(e: JQueryEventObject): void;
        close(): void;
        selectChange(e: JQueryEventObject): void;
        messageChanged(e: JQueryEventObject): void;
    }
    class ModalTemplate {
        private static dropdownButton;
        private static dropdownList;
        static template(): string;
        static dropdownTemplate(dialogSettings: IModalDialog): string;
    }
}
declare module Calendar {
    class Popover {
        private static messageTmp;
        private static noteTmp;
        static popover(cell: JQuery, message?: string, note?: string): void;
        static destroy(cell: JQuery): void;
        private static template(message?, note?);
    }
}
declare module Calendar {
    class Events {
        element: JQuery;
        settings: ISettings;
        indexes: IArrayIndexes;
        year: number;
        dialogSettings: IModalDialog;
        constructor(element: JQuery, settings: ISettings);
        setSelectedlYear(year: number): void;
        mousedown(e: JQueryEventObject): void;
        mouseover(e: JQueryEventObject): void;
        mouseup(e: JQueryEventObject): void;
        showModal(): void;
        removeSelection(): void;
        submitChanges(): void;
        deleteItems(): void;
        applyEventFormat(): void;
        removeEventFormat(): void;
        static dataEventFormat(data: Array<IData>, events: Array<IEvent>, year: number): void;
        private leftMousePressed(e);
        private resetIndexes();
        private createEventData();
    }
}
declare module Calendar {
    class EventCalendar {
        element: JQuery;
        settings: ISettings;
        events: Events;
        year: number;
        moveAction: any;
        constructor(element: JQuery, options: ISettings);
        defaultSettings(): ISettings;
        setEventFormat(): void;
        init(): void;
        destroy(): void;
        changeYear(e: JQueryEventObject): void;
        setSelectedYear(): void;
    }
}
