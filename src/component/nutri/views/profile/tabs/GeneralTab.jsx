import React from 'react';
import { User, Brain } from 'lucide-react';
// Importamos los ladrillos que creamos en la Fase 1
import Card from '../ui/Card';
import { InputGroup } from '../ui/FormComponents';

const GeneralTab = ({ patient, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in duration-300">
      
      {/* TARJETA DEMOGRÁFICA */}
      <Card title="Información Demográfica" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputGroup label="Nombre Completo" name="nombre_completo" value={patient.nombre_completo} onChange={onChange} placeholder="Ej. Juan Pérez" />
          <InputGroup label="Documento (C.I.)" name="cedula" value={patient.cedula} onChange={onChange} />
          
          <div className="flex gap-2">
             <InputGroup className="w-1/2" label="Edad" type="number" name="edad" value={patient.edad} onChange={onChange} suffix="años" />
             <InputGroup className="w-1/2" label="Nacimiento" value={patient.fecha_nacimiento || ''} onChange={()=>{}} placeholder="--/--/--" />
          </div>

          <InputGroup label="Sexo Biológico" name="sexo" value={patient.sexo} onChange={onChange} options={[{value: 'hombre', label: 'Hombre'}, {value: 'mujer', label: 'Mujer'}]} />
          <InputGroup label="Ocupación" name="ocupacion" value={patient.ocupacion} onChange={onChange} placeholder="Ej. Arquitecto" />
          <InputGroup label="Tipo Consulta" name="tipoConsulta" value={patient.tipoConsulta} onChange={onChange} options={[{value: 'online', label: 'Online'}, {value: 'presencial', label: 'Presencial'}, {value: 'hibrido', label: 'Híbrido'}]} />
        </div>
      </Card>
      
      {/* TARJETA INFORME */}
      <Card title="Informe Motivacional" icon={Brain}>
        <div className="space-y-6">
            <InputGroup label="Motivo de la Consulta" name="motivo" value={patient.motivo} onChange={onChange} placeholder="Ej. Pérdida de peso..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Expectativas del Paciente" type="textarea" name="expectativas" value={patient.expectativas} onChange={onChange} />
                <div className="relative">
                    <InputGroup label="Objetivos Clínicos (Nutricionista)" type="textarea" name="objetivosClinicos" value={patient.objetivosClinicos} onChange={onChange} className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg -m-2 p-2" />
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default GeneralTab;