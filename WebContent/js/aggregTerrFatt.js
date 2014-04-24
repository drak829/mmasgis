//Ext.override(Ext.data.proxy.Ajax, { timeout:270000 });
Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Fatt', {
	extend : 'Ext.data.Model',
	fields : []
});
var hide = true;
var intestazione;
var primaColonna;
Ext.onReady(function() {

	Ext.QuickTips.init();

	Ext.define('AggTerFattModel', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'Territorio',
			type : 'string'
		}, {
			name : 'NumPV',
			type : 'real'
		}, {
			name : 'Percentuale_PV',
			type : 'real'
		}, {
			name : 'NumClienti',
			type : 'real'
		}, {
			name : 'Percentuale_Clienti',
			type : 'real'
		}, {
			name : 'Fatturato',
			type : 'real'
		}, {
			name : 'Percentuale_Fatt',
			type : 'real'
		}],
		idProperty : 'cap'
	});
	var terrFattToolbar = Ext.create('Ext.toolbar.Toolbar', {
		height : 60,
		id : 'terrFattToolbar',
		items : [{
			xtype : 'box',
			autoEl : {
				tag : 'img',
				src : 'img/logo_mmas.png'
			},
			id : 'mmas',
			width : 110,
			height : 50
		}, '-', {
			id : 'expStatFattBtn',
			// text: 'Esporta statistiche',
			icon : 'img/expView.png',
			width : 50,
			height : 50,
			scale : 'medium',
			tooltip : 'esporta il risultato in formato excel',
			handler : function() {
				excelExport();
			}
		}, {
			xtype : 'textfield',
			id : 'base_num',
			fieldLabel : 'Base Numerica ',
			readOnly : true
		}, {
			xtype : 'textfield',
			id : 'base_cl',
			fieldLabel : 'Base Clienti ',
			readOnly : true
		}, {
			xtype : 'textfield',
			id : 'base_fatt',
			fieldLabel : 'Totale Fatturati ',
			readOnly : true
		}]
	});

	aggTerFattStore = Ext.create('Ext.data.Store', {
		remoteSort : true,
		model : 'AggTerFattModel',
		listeners : {
			load : function(store) {

				// Ext.getCmp('numRow').setText("Numero Anagrafiche: " +
				// store.getCount());
				Ext.getCmp('grigliaAggregazioneTerrFatt').setLoading(false);

				Ext.getCmp('base_num').setValue(aggTerFattGrid.store.getProxy().getReader().rawData.base_num);
				// console.debug(brandsGrid.store.getProxy().getReader().rawData.base_num);
				Ext.getCmp('base_cl').setValue(aggTerFattGrid.store.getProxy().getReader().rawData.base_cl);
				Ext.getCmp('base_fatt').setValue(aggTerFattGrid.store.getProxy().getReader().rawData.base_fatt);
			}
		}/*
			 * , reader: { type: 'json', root: 'selections', successProperty:
			 * 'success', id: 'cap' }
			 */,
		proxy : {
			type : 'ajax',
			// idProperty: 'pv_id',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// totalProperty: 'total',
				id : 'cap'
			},
			actionMethods : {
				create : 'POST',
				read : 'POST',
				update : 'POST',
				destroy : 'POST'
			},
			extraParams : {
				// selections: selection_string,
				task : 'aggTerFatt',
				censimento : dbname,
				classe : classe,
				layer : layer,
				reg : reg,
				pro : pro,
				com : com,
				cap : cap,
				parametri : parametri,
				potenziali : potenziali,
				marche : marche
			}
		}
	});

	if (layer == 'cap') {
		hide = false;
		intestazione = 'Aree CAP e Comuni';
		primaColonna = 'Comune';
	}
	else {
		intestazione = layer;
		primaColonna = layer;
	}

	aggTerFattGrid = Ext.create('Ext.grid.Panel', {
		frame : true,
		layout : 'fit',
		title : 'Analisi distribuzione fatturati per pv: ' + dbname + ' -> ' + intestazione,
		id : 'grigliaAggregazioneTerrFatt',
		store : aggTerFattStore,
		selType : 'cellmodel',
		tbar : terrFattToolbar,
		emptyText : 'Nessun record presente',
		columns : [{
			dataIndex : 'base_num',
			name : 'base_num',
			text : 'base_num',
			hidden : true
		}, {
			dataIndex : 'base_cl',
			text : 'base_cl',
			hidden : true
		}, {
			dataIndex : 'base_fatt',
			text : 'base_fatt',
			hidden : true
		}, {
			dataIndex : 'Territorio',
			text : primaColonna,
			flex : 1
		}, {
			dataIndex : 'NumPV',
			text : 'Numero PV',
			flex : 0.5
		}, {
			dataIndex : 'Percentuale_PV',
			flex : 1,
			text : "% PV"
		}, {
			dataIndex : 'NumClienti',
			flex : 1,
			text : "Numero clienti"
		}, {
			dataIndex : 'Percentuale_Clienti',
			flex : 1,
			text : "% clienti"
		}, {
			dataIndex : 'Fatturato',
			flex : 1,
			text : "Fatturato"
		}, {
			dataIndex : 'Percentuale_Fatt',
			flex : 1,
			text : "% Fatturato"
		}]
	});

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [aggTerFattGrid],
		listeners : {
			afterrender : function(item) {

				checkAuth('statFatt');
			}
		}
	});

	Ext.getCmp('grigliaAggregazioneTerrFatt').setLoading('Caricamento Aggregazione Territoriale Fatturati');
	aggTerFattStore.load();

});
function excelExport() {

	data = new Array();
	for (i in aggTerFattGrid.getStore().data.items) {
		data[i] = aggTerFattGrid.getStore().data.items[i].data;
		// console.debug(data[i]);

	}
	encodedData = Ext.JSON.encode(data);
	// console.debug(encodedData);
	var form = document.getElementById('estrazioni');
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'exportStat';
	form.censimento.value = dbname;
	form.selections.value = encodedData;
	form.header.value = getExcelHeader('grigliaAggregazioneTerrFatt');
	form.submit();
}
function getExcelHeader(cmp) {

	store = Ext.getCmp(cmp);

	arr = new Array();
	dataOutput = new Array();
	for (n in store.columns) {
		// if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		// }
	}
	dataOutput = arr.slice(3, 12);

	encodedHeader = Ext.JSON.encode(dataOutput);
	// console.debug(encodedHeader);
	return encodedHeader;
}
