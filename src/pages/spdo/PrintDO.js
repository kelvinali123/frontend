import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Col,
	Form,
	FormGroup,
	Label,
	Row,
	Table,
} from 'reactstrap';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

class PrintDO extends React.Component {

    render() {
        var tglDO;

        try {
            const tglDOProps = this.props.tglDO;

            const tglDODate = tglDOProps.substr(8, 2);
            const tglDOMonth = MONTHS[parseInt(tglDOProps.substr(5, 2)) - 1];
            const tglDOYear = tglDOProps.substr(0, 4);

            tglDO = `${tglDODate}-${tglDOMonth}-${tglDOYear}`;
        } catch (error) {
            tglDO = '1900-01-01';
        }
        return (
            <Card className='m-1 p-4'>
                <CardHeader>
                    <Row className='d-flex justify-content-between'>
                        <Label></Label>
                        <Label>Page : 1</Label>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <h2 className='font-weight-bold'>DELIVERY ORDER</h2>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Dari</Label>
                                    <Label className='w-100 text-wrap'>[PBF] {this.props.outnameDari}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Tujuan</Label>
                                    <Label className='w-100 text-wrap'>{this.props.namaOutlet}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Alamat</Label>
                                    <Label className='w-100 text-wrap'>{this.props.outaddressDari}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Alamat</Label>
                                    <Label className='w-100 text-wrap'>{this.props.outaddressTujuan}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
                <CardBody>
                    <Form>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Telepon</Label>
                                    <Label className='w-100 text-wrap'>{this.props.telpDari}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Telepon</Label>
                                    <Label className='w-100 text-wrap'>{this.props.telpTujuan}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Ijin PBF</Label>
                                    <Label className='w-100 text-wrap'>{this.props.ijinDari}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>Ijin PBF</Label>
                                    <Label className='w-100 text-wrap'>{this.props.ijinTujuan}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>APJ</Label>
                                    <Label className='w-100 text-wrap'>{this.props.apj}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>APJ</Label>
                                    <Label className='w-100 text-wrap'>{this.props.apjTujuan}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>SIKA</Label>
                                    <Label className='w-100 text-wrap'>{this.props.sika}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>SIKA</Label>
                                    <Label className='w-100 text-wrap'>{this.props.sikaTujuan}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>NPWP</Label>
                                    <Label className='w-100 text-wrap'>{this.props.npwpDari}</Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'>NPWP</Label>
                                    <Label className='w-100 text-wrap'>{this.props.npwpTujuan}</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
                <CardBody>
                    <Row>
                        <Col md={2} xs={2}>
                            <Label className='ml-3 font-weight-bold'>No DO</Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'>:</Label>
                        </Col>
                        <Col>
                            <Label>{this.props.noDO}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} xs={2}>
                            <Label className='ml-3 font-weight-bold'>Tanggal</Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'>:</Label>
                        </Col>
                        <Col>
                            <Label>{tglDO}</Label>
                        </Col>
                    </Row>
                </CardBody>
                <CardBody>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th className="text-center">PROCOD</th>
                                <th>NAMA BARANG</th>
                                <th className="text-center">BATCH NUMBER</th>
                                <th className="text-center">EXPIRED DATE</th>
                                <th className="text-center">QUANTITY</th>
                                <th className="text-center">SATUAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.transFD &&
                                this.props.transFD.map(transFD =>
                                    <tr>
                                        <td className="text-center">{transFD.TransfD_ProCod}</td>
                                        <td>{transFD.Pro_Name}</td>
                                        <td className="text-center">{transFD.TransfD_BatchNumber}</td>
                                        <td className="text-center">
                                            {
                                                transFD.TransfD_ED &&
                                                transFD.TransfD_ED.substr(5, 2) + '/' + // Month
                                                transFD.TransfD_ED.substr(8, 2) + '/' + // Date
                                                transFD.TransfD_ED.substr(0, 4) // Year
                                            }
                                        </td>
                                        <td className="text-center">{transFD.TransfD_Qty_Scan}</td>
                                        <td className="text-center">{transFD.pack_name}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                    <Card className='mt-4'></Card>
                    <Row className='mt-4'>
                        <Col>
                            <Label className='ml-3'><span className='mr-3 font-weight-bold'>BERAT TOTAL: </span>{parseInt(this.props.totalBerat)} gr</Label>
                        </Col>
                    </Row>
                    <Card className='mb-4'></Card>
                    <Row>
                        <Col md={3} xs={3}>
                            <Label className='ml-3 font-weight-bold'>Jumlah Total Quantity DO</Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'>:</Label>
                        </Col>
                        <Col>
                            <Label>{this.props.totalQTY}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} xs={3}>
                            <Label className='ml-3 font-weight-bold'>Jumlah Total Procod DO</Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'>:</Label>
                        </Col>
                        <Col>
                            <Label>{this.props.transFD && this.props.transFD.length}</Label>
                        </Col>
                    </Row>
                    <div className='my-4'></div>
                    <Row className='d-flex justify-content-around'>
                        <Col>
                            <Label className='w-100 text-center font-weight-bold'>DIBUAT,</Label>
                            <div className='my-5' />
                            <Label className='mt-5 w-100 text-center'>{this.props.pembuat}</Label>
                        </Col>
                        <Col>
                            <Label className='w-100 text-center font-weight-bold'>MENGETAHUI,</Label>
                            <div className='my-5' />
                            <Label className='mt-5 w-100 text-center'>{this.props.apj}</Label>
                            <Label className='w-100 text-center font-weight-bold'></Label>
                        </Col>
                        <Col>
                            <Label className='w-100 text-center font-weight-bold'>DITERIMA,</Label>
                            <div className='my-5' />
                            <Label className='mt-5 w-100 text-center'></Label>
                            <Label className='w-100 text-center font-weight-bold'></Label>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

export default PrintDO;