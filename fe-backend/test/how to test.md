# How to test?
## Unit test
* use template function
```
    const template = require('./test/template');
```
* define hook function
```
    testHook = function () {
        return new Promise(r => {
            comDoc.find({}).limit(DOC_NUMBERS).exec((err, res) => {
                if (err)

                else {
                    r(new Res(true, "/loadFirstDocList ok", res))
                }
            })

        })
    }
```
* define is_test variable
