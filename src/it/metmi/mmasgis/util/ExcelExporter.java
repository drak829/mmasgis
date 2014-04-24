package it.metmi.mmasgis.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.ServletOutputStream;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableCell;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

/**
 * Classe che gestisce la creazione e il popolamento del file Excel
 * 
 * @author Giuseppe
 *
 */
public class ExcelExporter {
	
	/**
	 * File Excel
	 */
	ServletOutputStream file;
	
	/**
	 * Header del file, ovvero le intestazioni di colonna
	 */
	ArrayList<String> header;
	
	/**
	 * Flag che indica l'avvenuto caricamento dell'header
	 */
	Boolean loadedHead;
	
	/**
	 * Numero riga
	 */
	Integer row;
	
	/**
	 * Foglio dei documento Excel
	 */
	WritableSheet sheet;
	
	/**
	 * Workbook del documento Excel
	 */
	WritableWorkbook workbook;
	
	
	/**
	 * Crea il workbook e inserisce il primo foglio vuoto
	 * 
	 * @param file File Excel
	 * @param header Intestazioni di colonna
	 */
	public ExcelExporter(ServletOutputStream file, ArrayList<String> header) {
		this.header = header;
		this.loadedHead = new Boolean(true);
		this.file = file;
		this.row = new Integer(1);
		this.header = new ArrayList<String>();
		try {
			this.workbook = Workbook.createWorkbook(file);
			this.sheet = this.workbook.createSheet("First Sheet", 0);
			writeHeader(header);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	
	
	/**
	 * Inserisce i dati nel foglio
	 * 
	 * @param fromJson Dati da inserire nel foglio
	 * @param header Intestazioni di colonna
	 */
	public void exportList(ArrayList<HashMap<String, String>> fromJson, ArrayList<String> header) {
		int row = 1;
		Iterator<HashMap<String, String>> i = fromJson.iterator();
		while (i.hasNext()) {
			Map<String, String> r = i.next();
			/*Set<Entry<String,String>> entries = r.entrySet();
	        Iterator<Entry<String,String>> ite = entries.iterator();
	        while (ite.hasNext()) {
	        	Entry<String,String> next = ite.next(); //next entry of the Map
	          	System.err.println(next.getKey()+"  "+next.getValue());
	        }*/
			Iterator<String> h=header.iterator();
			Integer c=new Integer(0);
			boolean isNumber;
			//ciclo il record e riempio le celle corrispondenti
			while ( h.hasNext()) {
				isNumber=true;
				String s=h.next();
				String valore=r.get(s);
				//verifica se il valore è un numero o una stringa e successiva conversione per poter eseguire operazioni in excel sui valori stessi
				if(valore!=null && valore.length()!=0){
					for(int j=0;j<valore.length();j++){
						if(!Character.isDigit(valore.charAt(j)) && valore.charAt(j)!='.'){
							isNumber=false;
							break;
						}
					}
				if(isNumber==false){
					Label label = new Label(c,row,valore);
					try {
						this.sheet.addCell(label);
					} catch (RowsExceededException e) {
						e.printStackTrace();
					} catch (WriteException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				else{
						if(valore.length()>6 || s.equals("cap")){
							Label label = new Label(c,row,valore);
							try {
								this.sheet.addCell(label);
							} catch (RowsExceededException e) {
								e.printStackTrace();
							} catch (WriteException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						}
						else{
							Number label=new Number(c,row,Double.parseDouble(valore));
							try {
								this.sheet.addCell(label);
							} catch (RowsExceededException e) {
								e.printStackTrace();
							} catch (WriteException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						}
						
					}
				}
				c+=1;
				
			}
			
			
			row = row+1;
		}
		close();
	}
	
	
	/**
	 * Scrive l'header nel foglio
	 * 
	 * @param header Intestazioni di colonna
	 */
	private void writeHeader(ArrayList<String> header) {
		Iterator<String> h=header.iterator();
		Integer c=new Integer(0);
		while ( h.hasNext()) {
			String s=h.next();
			Label label = new Label(c,0, s); 
			c+=1;
			try {
				this.sheet.addCell(label);
			} catch (RowsExceededException e) {
				e.printStackTrace();
			} catch (WriteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	
	/**
	 * Finalizza la scrittura e chiude il workbook
	 */
	private void close() {
		try {
			this.workbook.write();
			this.workbook.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (WriteException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 

	}
}
