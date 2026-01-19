
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  X, 
  Briefcase,
  Loader2,
  CreditCard,
  BriefcaseBusiness,
  Contact2
} from 'lucide-react';

const clientSchema = z.object({
  razaoSocial: z.string().min(3, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().min(3, 'Nome Fantasia é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  endereco: z.string().min(5, 'Endereço completo é obrigatório'),
  segmento: z.string().min(1, 'Selecione um segmento'),
  responsavel: z.string().min(3, 'Nome do cliente é obrigatório'),
  cargo: z.string().min(2, 'Cargo é obrigatório'),
  email: z.string().email('E-mail corporativo inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  billingSameAsCompany: z.boolean().default(true),
  billingCnpj: z.string().optional(),
  billingRazaoSocial: z.string().optional(),
  billingLogradouro: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface CreateClientFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ onCancel, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingSame, setBillingSame] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientFormValues>({
    defaultValues: { billingSameAsCompany: true }
  });

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    // Simulação de integração com Supabase/Backend
    console.log('[CRM] Salvando novo lead no ecossistema:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-lead flex items-center gap-3 tracking-tight">
            <Building2 className="w-8 h-8 text-primary" />
            Novo Cliente Prospect
          </h2>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-1">
            GPE Floxhub • Cadastro de Lead B2B
          </p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-surface rounded-full transition-colors">
          <X className="w-6 h-6 text-muted" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-[32px] shadow-soft border border-border overflow-hidden">
        <div className="p-8 md:p-12 space-y-10">
          
          {/* Dados da Organização */}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
              <BriefcaseBusiness className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-lead uppercase tracking-[0.2em]">Dados da Organização</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Razão Social</label>
                <input {...register('razaoSocial')} placeholder="Ex: Floxhub Soluções Tecnológicas LTDA" className="w-full px-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                {errors.razaoSocial && <p className="text-[9px] font-bold text-red-500 uppercase mt-1 ml-1">{errors.razaoSocial.message}</p>}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Nome Fantasia</label>
                <input {...register('nomeFantasia')} placeholder="Ex: Floxhub GPE" className="w-full px-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                {errors.nomeFantasia && <p className="text-[9px] font-bold text-red-500 uppercase mt-1 ml-1">{errors.nomeFantasia.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">CNPJ</label>
                <input {...register('cnpj')} placeholder="00.000.000/0001-00" className="w-full px-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Segmento</label>
                <select {...register('segmento')} className="w-full px-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none bg-white">
                  <option value="">Selecione...</option>
                  <option value="TI">Tecnologia & Dev</option>
                  <option value="MARKETING">Marketing & Creative</option>
                  <option value="LOGISTICS">Logística & Supply</option>
                  <option value="INDUSTRY">Indústria</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Endereço Principal</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input {...register('endereco')} placeholder="Rua, Número, Bairro, Cidade - UF" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </div>
              </div>
            </div>
          </section>

          {/* Interlocutor Principal */}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
              <Contact2 className="w-5 h-5 text-primary" />
              <h3 className="text-[10px] font-black text-lead uppercase tracking-[0.2em]">Interlocutor Principal</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Nome do Cliente</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input {...register('responsavel')} placeholder="Ex: Roberto Mendes" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Cargo</label>
                <input {...register('cargo')} placeholder="Ex: Diretor de Operações" className="w-full px-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input {...register('email')} type="email" placeholder="cliente@empresa.com.br" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input {...register('telefone')} placeholder="(00) 00000-0000" className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-border outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </div>
              </div>
            </div>
          </section>

          {/* Dados de Faturamento Simplificados */}
          <section className="bg-background/40 p-8 rounded-3xl border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-[10px] font-black text-lead uppercase tracking-widest">Faturamento Fiscal</h3>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={billingSame} 
                  onChange={(e) => {
                    setBillingSame(e.target.checked);
                    setValue('billingSameAsCompany', e.target.checked);
                  }} 
                />
                <div className={`w-12 h-6 rounded-full relative transition-all ${billingSame ? 'bg-primary shadow-[0_0_10px_rgba(0,224,84,0.3)]' : 'bg-border'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${billingSame ? 'right-1' : 'left-1'}`}></div>
                </div>
                <span className="text-[10px] font-black uppercase text-muted group-hover:text-lead transition-colors">Mesmos dados acima</span>
              </label>
            </div>

            {!billingSame && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Razão Social de Faturamento</label>
                  <input {...register('billingRazaoSocial')} className="w-full px-5 py-3.5 rounded-2xl border border-border bg-white outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-wider ml-1">Endereço Fiscal</label>
                  <input {...register('billingLogradouro')} className="w-full px-5 py-3.5 rounded-2xl border border-border bg-white outline-none transition-all text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="bg-background px-10 py-8 flex items-center justify-end gap-6 border-t border-border">
          <button 
            type="button" 
            onClick={onCancel} 
            className="text-xs font-black uppercase text-muted hover:text-lead transition-colors tracking-widest"
          >
            Descartar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-10 py-4 rounded-2xl bg-lead text-white text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-3 disabled:opacity-70 group hover:bg-primary hover:text-lead transition-all active:scale-95"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Efetivar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClientForm;
