# QR Code API

## API Endpoints

```
POST /upload
```
Content-type: multipart/form-data
Send file in the 'file' attribute

```
GET /decode?url=<image url>
```

Send URL in the query param of the request

## Response

```json
{
	"result": "<Data in the QR Code here>"
}
```


## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```
