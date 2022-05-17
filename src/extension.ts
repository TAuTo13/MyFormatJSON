import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const formatText = vscode.commands.registerCommand("MyFormatJSON.formatJSON",()=>{
		const editor = vscode.window.activeTextEditor;
		if(editor){
			const selection=editor.selection
			const doc=editor.document;
			const text=doc.getText(selection);
			if(text){
				let textFormatted = formatJSON(text);
				if(textFormatted){
					editor.edit(editBuilder => {
						editBuilder.replace(selection,textFormatted);
					})
				}

			}
		}
	});

	context.subscriptions.push(formatText);
}

export function formatJSON(text :string) {
	// const conf = vscode.workspace.getConfiguration("editor");

	let returnText="";

	let idt=0
	let tmpText=""
	for(let i=0;i<text.length-1;i++){
		let c=text[i];

		tmpText+=c;

		let cNext=text[i+1];
		switch(cNext){
			case "]":
				if(c=="["){
					continue;
				}
			case "}":
				idt--;
				returnText+=indent(idt,tmpText);
				tmpText="";
				continue;
		}
		
		switch(c){
			case "{":
			case "[":
				idt++;
				returnText+=indent(idt,tmpText);
				tmpText="";
				break;
			case ",":
				returnText+=indent(idt,tmpText);
				tmpText="";
				break;
		}
	}

	returnText+=text[text.length-1];

	return returnText;
}

export function indent(idt : number,text:string){
	text+="\n";

	for(let i=0;i<idt;i++){
		text+="\t";
	}

	return text;
}
