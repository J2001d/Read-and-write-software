const fs = require('fs');
const csv = require('csv-parser');
const isbn = require('node-isbn');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });


// to store isbn as key and books and magazine as values  
let gISBN = new Map();
let gEmail = new Map();
let allData = new Set();
const readCSVauthors = (fileName)=>{
    var results = [];
    fs.createReadStream(fileName)
    .pipe(csv({separator: ';'}))
    .on('data',(data)=>results.push(data))
    .on('end',()=>{
        // console.log(results);
        // for(const result of results){
        //     console.log(`First Name: ${result.firstname}`)
        //     console.log(`Last Name: ${result.lastname}`)
        //     console.log(`Email: ${result.email}`)
        // }
    })
};

const readCSVbooks = (fileName)=>{
    var results = [];

    fs.createReadStream(fileName)
    .pipe(csv({separator: ';'}))
    .on('data',(data)=>results.push(data))
    .on('end',()=>{
        // console.log(results);
        for(const result of results){
        //     console.log(`Title: ${result.title}`)
        //     console.log(`isbn: ${result.isbn}`)
        //     console.log(`Authors: ${result.authors}`)
        //     console.log(`Description: ${result.description}`)
            gEmail.set(result.authors,[result.title]);
            gISBN.set(result.isbn,[result.title]);
            allData.add(result.title);
        }
    })
};
const readCSVmagazines = (fileName)=>{
    var results = [];

    fs.createReadStream(fileName)
    .pipe(csv({separator: ';'}))
    .on('data',(data)=>results.push(data))
    .on('end',()=>{
        // console.log(results);
        for(const result of results){
        //     console.log(`Title: ${result.title}`)
        //     console.log(`isbn: ${result.isbn}`)
        //     console.log(`Authors: ${result.authors}`)
        //     console.log(`Published at: ${result.publishedAt}`)
                allData.add(result.title);
                gEmail.set(result.authors,[result.title]);
                gISBN.set(result.isbn,[result.title]);
        }
        
    })
};


readCSVauthors('authors.csv');
readCSVbooks('books.csv');
readCSVmagazines('magazines.csv');

// Finding a book or magazine by its ISBN 
rl.question('Enter the ISBN for which you need to find the Book/Magazine? ', (ISBN) => {
    if(gISBN.has(ISBN)){
        console.log(gISBN.get(ISBN));
    }else{
        console.log("Sorry ! ISBN is wrong");
    }
    
    // Finding all books and magazine by their author email
    rl.question('Enter the email for which you need to find the Book/Magazine? ', (Email) => {
        // console.log(`Hi ${name}!`);
        if(gEmail.has(Email)){
            console.log(gEmail.get(Email));
        }else{
            console.log("Sorry ! Wrong email entered");
        }

            // printing all books and magazines with all their details sorted by title 
            rl.question('Do you want to print all the data in sorted manner Press 1 to continue: ', (answer) => {
                // console.log(`You entered: ${answer}`);
                if(answer === '1'){
                    console.log('All the books and magazines in sorted order:')
                    for (let item of allData) {
                        console.log(item);
                    }
                }

                // add book and magazine and export it to new csv file
                rl.question('Do you want to export all the data to NewFile Press 1 to continue: ', (answer) => {
                    // console.log(`You entered: ${answer}`);
                    if(answer === '1'){
                        let data = Array.from(allData).join('\n');
                        fs.writeFile('NewFile.csv', data, (error) => {
                            if (error) {
                            console.error(error);
                            } else {
                            console.log('All data exported to NewFile.csv.');
                            }
                        });        
                    }
                    rl.close();
                });
            }); 
    });
});

