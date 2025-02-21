'use client';

import useAuth from "@/hooks/useAuth";
import useHttpRequest from "@/hooks/useHttpRequest";
import { Button, Col, Divider, Form, Input, message, Row } from "antd"
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const [form] = Form.useForm();
  const {httpRequest} = useHttpRequest();
  const {setToken, setUserData} = useAuth();
  const router = useRouter();
  
  const onFinish = async (data:any) => {
    try{
      const res = await httpRequest('/signup',data, 'post');
      console.log(res);
      if(res.status === 201){
        setToken(res?.data?.token);
        setUserData(res?.data?.user);
        message.success('Registro exitoso');
        router.push('/');
      }
    }catch(err:any){
      message.error('Hable con el administrador');
    }
  };
  return (
    // <div className="flex mx-auto justify-center items-center bg-gray-50 bg-opacity-80 h-screen">
    <div className="w-full max-w-md bg-white shadow">
      <div className="p-10 bg-white">
      
    <Form form={form} onFinish={onFinish}  layout="vertical" style={{background:'white'}}>
        <Divider className="!text-blue-500 !text-xl">Register</Divider>
      <Row>
        <Col span={24}>
            <Form.Item
            label='Nombre'
            name='firstname'
            rules={[{required:true, message:'Campo ocligatorio'}]}
            >
                <Input placeholder="User User" style={{border:'none', borderBottom:'2px dashed #cce0ff ',  outline: 'none',}}
                  onFocus={(e) => e.target.style.boxShadow = 'none'}
                />
            </Form.Item>
        </Col>
        <Col span={24}>
            <Form.Item
            label='Apellido'
            name={'lastname'}
            rules={[{required:true, message:'Campo ocligatorio'}]}
            >
                <Input placeholder="Ruiz Ruiz" style={{border:'none', borderBottom:'2px dashed #cce0ff ',outline: 'none',  boxShadow: 'none'}}
                onFocus={(e) => e.target.style.boxShadow = 'none'}
                />
            </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
            <Form.Item
            label='Correo'
            name='email'
            rules={[{required:true, message:'Campo ocligatorio'}]}
            >
                <Input placeholder="Email" style={{border:'none', borderBottom:'2px dashed #cce0ff ',  outline: 'none',}}
                  onFocus={(e) => e.target.style.boxShadow = 'none'}
                />
            </Form.Item>
        </Col>
        <Col span={24}>
            <Form.Item
            label='Contraseña'
            name={'password'}
            rules={[{required:true, message:'Campo ocligatorio'}]}
            >
                <Input.Password placeholder="123****" style={{border:'none', borderBottom:'2px dashed #cce0ff ',outline: 'none',  boxShadow: 'none'}}
                onFocus={(e) => e.target.style.boxShadow = 'none'}
                />
            </Form.Item>
        </Col>
      </Row>
      <Row  align={'middle'} justify='end'>
        <span>Ya tienes cuenta?</span>
        <Link href={'/auth/login'} className="!text-blue-500 !ml-2">
            Iniciar
        </Link>
          
      </Row>
      <Button htmlType="submit" type="primary">
        Guardar
      </Button>
    </Form>
    </div>
    </div>
  )
}

export default Register;