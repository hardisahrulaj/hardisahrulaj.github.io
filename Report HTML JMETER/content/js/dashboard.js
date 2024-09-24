/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.21090337235715, "KoPercent": 8.789096627642845};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28429145553031626, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0032679738562091504, 500, 1500, "Delete Product"], "isController": false}, {"data": [0.2265625, 500, 1500, "products.json Create Product"], "isController": false}, {"data": [0.32263513513513514, 500, 1500, "Update Profile"], "isController": false}, {"data": [0.0637065637065637, 500, 1500, "Delete Product-1"], "isController": false}, {"data": [0.3660436137071651, 500, 1500, "Create Offer"], "isController": false}, {"data": [0.45222929936305734, 500, 1500, "Get Product by id "], "isController": false}, {"data": [0.3474903474903475, 500, 1500, "Delete Product-0"], "isController": false}, {"data": [0.3783783783783784, 500, 1500, "Get Profile"], "isController": false}, {"data": [0.38011695906432746, 500, 1500, "Login"], "isController": false}, {"data": [0.007352941176470588, 500, 1500, "Update Offer"], "isController": false}, {"data": [0.37579617834394907, 500, 1500, "Get Product"], "isController": false}, {"data": [0.6292834890965732, 500, 1500, "Get Category ID"], "isController": false}, {"data": [0.13539445628997868, 500, 1500, "Registration"], "isController": false}, {"data": [0.3515625, 500, 1500, "List Offers"], "isController": false}, {"data": [0.5297619047619048, 500, 1500, "List Categories"], "isController": false}, {"data": [0.09571428571428571, 500, 1500, " Update Product"], "isController": false}, {"data": [0.08035714285714286, 500, 1500, "Update Offer-1"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "Update Offer-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5723, 503, 8.789096627642845, 1625.3634457452463, 4, 7204, 1327.0, 3201.0, 3916.8, 5283.840000000002, 0.5872986080417527, 4.671329052747788, 1.0015525590949341], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Product", 306, 46, 15.032679738562091, 3113.1797385620926, 4, 6406, 3280.5, 4586.300000000001, 5247.9, 5999.820000000001, 0.5596984213212175, 15.612262531140084, 0.4271526526001284], "isController": false}, {"data": ["products.json Create Product", 320, 46, 14.375, 1535.971875000001, 145, 4174, 1331.0, 2953.1000000000004, 3477.8499999999995, 3991.37, 0.5904244229062535, 1.1539979402029217, 6.14983758139093], "isController": false}, {"data": ["Update Profile", 296, 36, 12.162162162162161, 1218.5202702702697, 92, 3534, 1193.0, 2045.2, 2301.8999999999996, 3116.039999999998, 0.5416493588957673, 0.7106431582915353, 0.5596481063316248], "isController": false}, {"data": ["Delete Product-1", 259, 0, 0.0, 2204.760617760621, 645, 4503, 2059.0, 3236.0, 3490.0, 4280.4, 0.640119423052208, 20.532300659335363, 0.25567269924643854], "isController": false}, {"data": ["Create Offer", 321, 41, 12.77258566978193, 1047.2056074766356, 95, 3460, 866.0, 2183.2, 2611.999999999999, 3230.139999999996, 0.05777209215602568, 0.16087565512157698, 0.02995675889384261], "isController": false}, {"data": ["Get Product by id ", 314, 4, 1.2738853503184713, 1037.7738853503186, 185, 3704, 849.5, 1960.0, 2151.25, 3248.350000000007, 0.5761203614513096, 1.2351909746112564, 0.2377148697307463], "isController": false}, {"data": ["Delete Product-0", 259, 0, 0.0, 1393.1737451737442, 122, 3162, 1256.0, 2286.0, 2719.0, 3110.9999999999986, 0.6392457393901251, 0.4444755531696963, 0.2815428012352992], "isController": false}, {"data": ["Get Profile", 296, 36, 12.162162162162161, 1066.1114864864865, 46, 3032, 992.0, 1853.2, 2251.749999999999, 2930.0099999999984, 0.5417028869469734, 0.7206108169007641, 0.2212463398453585], "isController": false}, {"data": ["Login", 342, 5, 1.4619883040935673, 1487.0730994152052, 196, 4988, 1075.0, 3223.7, 3517.5999999999976, 4837.5, 0.636742262743689, 1.2406790480377352, 0.3344929608096308], "isController": false}, {"data": ["Update Offer", 340, 60, 17.647058823529413, 3339.229411764705, 320, 7204, 3064.0, 5321.800000000001, 5972.399999999999, 6847.749999999997, 0.6124691513699494, 16.469215614473185, 0.5020642687298471], "isController": false}, {"data": ["Get Product", 314, 0, 0.0, 1254.8248407643305, 386, 3955, 1057.5, 2092.5, 2476.5, 3370.500000000001, 0.5770626774605566, 6.862865272979132, 0.27668627730250767], "isController": false}, {"data": ["Get Category ID", 321, 1, 0.3115264797507788, 774.314641744548, 96, 3038, 636.0, 1580.6000000000004, 1990.9, 2882.7, 0.5996278944654906, 0.43440113448290035, 0.24809370633550767], "isController": false}, {"data": ["Registration", 469, 24, 5.11727078891258, 2042.3390191897647, 132, 4562, 1910.0, 3136.0, 3200.5, 3708.4, 0.04824231342568153, 0.08838966277028554, 0.0268060176062843], "isController": false}, {"data": ["List Offers", 320, 40, 12.5, 1052.6687500000007, 94, 3901, 849.5, 2159.5000000000014, 2530.7, 3375.6200000000017, 0.594974694982504, 1.7160811114359715, 0.3509421052435864], "isController": false}, {"data": ["List Categories", 336, 5, 1.4880952380952381, 973.1488095238099, 44, 4190, 768.5, 1930.1000000000001, 2437.5, 3981.9499999999985, 0.6273432015414719, 0.6753989627365606, 0.25529577551569105], "isController": false}, {"data": [" Update Product", 350, 159, 45.42857142857143, 1870.154285714285, 5, 6508, 1633.5, 3439.500000000001, 4505.999999999999, 5709.630000000003, 0.6625838878529443, 0.9190837174742302, 6.957837036309597], "isController": false}, {"data": ["Update Offer-1", 280, 0, 0.0, 2416.4000000000005, 740, 4659, 2234.5, 3835.0, 4115.4, 4476.49, 0.6590173580464843, 20.747883109002647, 0.2632208002353633], "isController": false}, {"data": ["Update Offer-0", 280, 0, 0.0, 1244.1392857142857, 250, 3746, 1067.0, 2398.8, 2750.149999999999, 3277.299999999999, 0.6609151314158926, 0.7123969901806895, 0.3252941662437597], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 0.1988071570576541, 0.017473353136466887], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 59, 11.72962226640159, 1.0309278350515463], "isController": false}, {"data": ["500/Internal Server Error", 115, 22.86282306163022, 2.009435610693692], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A request to send or receive data was disallowed because the socket had already been shut down in that direction with a previous shutdown call", 1, 0.1988071570576541, 0.017473353136466887], "isController": false}, {"data": ["401/Unauthorized", 327, 65.00994035785288, 5.713786475624673], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5723, 503, "401/Unauthorized", 327, "500/Internal Server Error", 115, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 59, "400/Bad Request", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A request to send or receive data was disallowed because the socket had already been shut down in that direction with a previous shutdown call", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete Product", 306, 46, "401/Unauthorized", 36, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["products.json Create Product", 320, 46, "401/Unauthorized", 40, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["Update Profile", 296, 36, "401/Unauthorized", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Offer", 321, 41, "401/Unauthorized", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Product by id ", 314, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Profile", 296, 36, "401/Unauthorized", 34, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Login", 342, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Offer", 340, 60, "401/Unauthorized", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Category ID", 321, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Registration", 469, 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 23, "400/Bad Request", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["List Offers", 320, 40, "401/Unauthorized", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["List Categories", 336, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [" Update Product", 350, 159, "500/Internal Server Error", 115, "401/Unauthorized", 40, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A request to send or receive data was disallowed because the socket had already been shut down in that direction with a previous shutdown call", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
