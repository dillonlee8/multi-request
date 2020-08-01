# Multi-Request

Mullti-Request is a utility function with zero dependencies that enables you to call an array of endpoints and retrieve the responses using a promise chain.

## Example

```
// make multiple requests
multiRequest([
  '/foo', '/bar'
  ]).then(data => console.log(data))
```
## Browser Support

Suopport for all modern browsers. IE not supported.

## Tests

To run tests 
`yarn install` then `yarn test`







