const { chromium } = require('playwright-chromium');
const { expect } = require('chai');


const mockData = {
    "d953e5fb-a585-4d6b-92d3-ee90697398a0":
        { "author": "J.K.Rowling", "title": "Harry Potter and the Philosopher's Stone" },
    "d953e5fb-a585-4d6b-92d3-ee90697398a1":
        { "author": "Svetlin Nakov", "title": "C# Fundamentals" }
};
const mockDataDel = {
       "d953e5fb-a585-4d6b-92d3-ee90697398a1":
        { "author": "Svetlin Nakov", "title": "C# Fundamentals" }
};

function json(data){
    return{
        status:200,
        headers:{
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }
}


describe('Testing', async function () {
    this.timeout(50000)
    let page, browser;

    before(async () => {
        // browser = await chromium.launch();
        browser = await chromium.launch({headless:false, slowMo:2000});
    });

    after(async () => {
        await browser.close()
    })

    beforeEach(async () => {
        page = await browser.newPage();

    })
    afterEach(async () => {
        await page.close();

    })

    it('load and display all books', async () => {
        await page.route('**/jsonstore/collections/books*',(route)=>{
            route.fulfill(json(mockData))
        })
        await page.goto('http://localhost:5500')

        await page.click('text=Load All Books')
        await page.waitForSelector('text=Harry Potter')

        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()))

        expect(rows[1]).to.contain('Harry Potter')
        expect(rows[1]).to.contain('J.K.Rowling')
        expect(rows[2]).to.contain('C# Fundamentals')
        expect(rows[2]).to.contain('Svetlin Nakov')
    })

    it('can create book', async () => {
        await page.goto('http://localhost:5500')

        await page.fill('form#createForm >> input[name="title"]','TitleBook')
        await page.fill('form#createForm >> input[name="author"]','AuthorBook')

        const[request]= await Promise.all([
            page.waitForRequest(r=>r.method()=='POST'),
            page.click('form#createForm >> text=Submit')
        ]);
        const data = JSON.parse(request.postData())

        expect(data.title).to.equal('TitleBook')
        expect(data.author).to.equal('AuthorBook')

    })

    
    it('can edit book', async () => {
        await page.route('**/jsonstore/collections/books*',(route)=>{
            route.fulfill(json(mockData))
        })

        await page.goto('http://localhost:5500')

        await page.click('text=Load All Books')
        await page.waitForSelector('text=Harry Potter')

        await page.click('[data-id="d953e5fb-a585-4d6b-92d3-ee90697398a0"] >> text=Edit')

        await page.fill('form#editForm >> input[name="title"]','Harry Potter - the Philosopher\'s Stone')
        await page.fill('form#editForm >> input[name="author"]','Joanne Rowling')

        const[request]= await Promise.all([
            page.waitForRequest(r=>r.method()=='PUT'),
            page.click('form#editForm >> text=Save')
        ]);
        const data = JSON.parse(request.postData())

        expect(data.title).to.equal('Harry Potter - the Philosopher\'s Stone')
        expect(data.author).to.equal('Joanne Rowling')
        
    })

    it('delete book', async () => {
        await page.route('**/jsonstore/collections/books*',(route)=>{
            route.fulfill(json(mockData))
        })

        await page.goto('http://localhost:5500')

        await page.click('text=Load All Books')
        await page.waitForSelector('text=Harry Potter')

        await page.click('[data-id="d953e5fb-a585-4d6b-92d3-ee90697398a0"] >> text=Delete')

        await page.route('**/jsonstore/collections/books*',(route)=>{
            route.fulfill(json(mockDataDel))
        })
               
        await page.click('text=Load All Books')
        await page.waitForSelector('text=C# Fundamentals')

        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()))

        expect(rows[1]).to.contain('C# Fundamentals')
        expect(rows[1]).to.contain('Svetlin Nakov')
        
    })

})