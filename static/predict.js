

$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
}); 

let model;
(async function () {
    model = await tf.loadLayersModel("http://localhost:54912/static/tfjs-models/vgg16/model.json");
    console.log(model)
})();

$("#predict-button").click(async function (){
    let image = $("#selected-image").get(0);
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims(); 
        
    let predictions = await model.predict(tensor).data();
    let top5 = Array.from(predictions)
        .map(function (p, i) {
            return {
                probability: p,
                className: CNN_CLASSES[i]
            };
        }).sort(function (a, b) {
            return b.probability - a.probability;
        }).slice(0, 5);
    
    $("#prediction-list").empty();
    top5.forEach(function (p) {
        $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
    });
});
