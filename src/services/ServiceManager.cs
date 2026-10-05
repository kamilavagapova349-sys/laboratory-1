using System.Collections.Generic;

namespace GlamourIntence.Services
{
    public class ServiceManager
    {
        public List<Service> Services { get; } = new List<Service>();

        public void AddService(Service service)
        {
            Services.Add(service);
        }

        public Service GetService(int index)
        {
            return Services[index];
        }
    }
}