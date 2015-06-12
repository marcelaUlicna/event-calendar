///<reference path="../typing/jquery.d.ts" />
///<reference path="../src/actions.ts" />

module Calendar { 
	export class MySubmitMethod extends PostDataAction {
		process(data: Array<IData>): void {
            this.data = data;
            console.log('MySubmitMethod', data);
        }
	}
	
	export class MyDeleteMethod extends PostDataAction {
		process(data: Array<IData>): void {
            this.data = data;
            console.log('MyDeleteMethod', data);
        }
	}
}